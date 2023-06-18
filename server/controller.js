require('dotenv').config()
const {CONNECTION_STRING} = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          rejectUnauthorized: false
      }
  }
})

const Member = sequelize.define('members', {
  member_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  date_of_birth: DataTypes.DATE,
  address: DataTypes.STRING,
  date_joined: DataTypes.DATE,
  role: DataTypes.STRING,
  membership_status: DataTypes.BOOLEAN,
  email: DataTypes.TEXT,
  phone_number: DataTypes.STRING
}, {
  timestamps: false,
  freezeTableName: true,
})

const Event = sequelize.define('events', {
  event_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, 
    primaryKey: true,
  },
  event_name: DataTypes.STRING,
  event_date: DataTypes.DATE,
  event_creation_date: DataTypes.DATE,
  host_id: DataTypes.INTEGER,
  location: DataTypes.STRING,
  member_guests: DataTypes.INTEGER,
  maximum_capacity: DataTypes.INTEGER,
  is_active: DataTypes.BOOLEAN,
  event_text: DataTypes.TEXT
}, {
  timestamps: false,
  freezeTableName: true,
})

const Discussion = sequelize.define('discussions', {
  discussion_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  discussion_name: DataTypes.STRING,
  discussion_text: DataTypes.TEXT,
  author_id: DataTypes.INTEGER,
  date_posted: DataTypes.DATE,
  is_active: DataTypes.BOOLEAN
}, {
  timestamps: false,
  freezeTableName: true,
})

const Attendance = sequelize.define('attendance', {
  member_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  status: DataTypes.BOOLEAN
}, {
  timestamps: false,
  freezeTableName: true,
})

Event.belongsTo(Member, {foreignKey: 'host_id'});
Member.hasMany(Event, {foreignKey: 'host_id'});

Member.hasMany(Attendance, { foreignKey: 'member_id' });
Attendance.belongsTo(Member, { foreignKey: 'member_id' })
Event.hasMany(Attendance, { foreignKey: 'event_id' });
Attendance.belongsTo(Event, { foreignKey: 'event_id' })

module.exports = {
  seed: (req, res) => {
  sequelize.query(`
        drop table if exists comments CASCADE;
        drop table if exists discussions CASCADE;
        drop table if exists attendance CASCADE;
        drop table if exists events CASCADE;
        drop table if exists members CASCADE;
        
        create table members (
          member_id serial primary key,
          first_name varchar(20),
	        last_name varchar(20) null,
	        date_of_birth date,
	        address varchar(50) null,
	        date_joined date,
	        role varchar(20),
	        membership_status boolean,
	        email text,
	        phone_number varchar(20)
        );

        create table events (
          event_id serial primary key,
          event_name varchar(50),
          event_date date null,
          event_creation_date date,
          host_id int references members(member_id),
          location varchar(50) null,
          member_guests int null,
          maximum_capacity int,
          is_active boolean,
          event_text text null
        );

        create table attendance (
          member_id int references members(member_id),
          event_id int references events(event_id),
          status boolean,
          primary key (member_id, event_id)
        );

        create table discussions (
          discussion_id serial primary key,
          discussion_name varchar(30),
          discussion_text text,
          author_id int references members(member_id),
          date_posted date,
          is_active boolean
          );

        create table comments (
          comment_id serial primary key,
          author_id int references members(member_id),
          discussion_id int references discussions(discussion_id),
          comment text,
          date_posted date,
          is_active boolean
          );

        insert into members (first_name, last_name, date_of_birth, address, date_joined, role, membership_status, email, phone_number)
        values ('Doris', 'the Ugly Stepsister', '1959-05-23', '3284, Evil Lane, Far Far Away', '2004-05-19','Kitchen Manager', true, 'UglyStepsisterIsMe@yahoo.com', '(746) 485-4846'),
        ('Gingy', NULL, '1980-02-28', NULL, '2001-05-18', 'Online Advocate', true, 'DeliciousCookie@AOL.com', 
        '(395) 724-2986'),
        ('Pinocchio', NULL, '1886-10-30', NULL, '2001-05-18', 'Carpenter', true, 'bigliar@aol.com', '(275) 824-1084'); 

        insert into events (event_name, event_date, event_creation_date, host_id, location, member_guests, maximum_capacity, is_active, event_text)
        values ('The Advent of Shrek 5', NULL, '2015-09-21', 2, 'The Temple of Shrek', 0, 10000, true, NULL),
        ('Yearly Meeting', '2023-05-18', '2023-01-18', 1, 'The Kitchen in the Temple of Shrek', 0, 9, true, NULL);

        insert into discussions (discussion_name, discussion_text, author_id, date_posted, is_active)
        values ('I am a friend not food!', 'I love you all, but Doris keeps giving me looks like she wants to use me in her meals. I do not know what I did to her, but I am concerned for my safety.', 2, '2016-12-22', true),
        ('The cake was not a lie!', 'I am sorry I did not make the cake in time for Dorises birthday. I just did not have timy765. OH NOT AGAIN!!', 3, '2022-03-01', true)
      `).then(() => {
          console.log('DB seeded!')
          res.sendStatus(200)
      }).catch(err => console.log('error seeding DB', err))
      },

      Member,
      
      createMember: (req, res) => {
        console.log(req.body) 
        let {fname, lname, dob, address, email, number} = req.body;

        lname = lname === "" ? null : lname;
        address = address === "" ? null : address;

        let date_joined = new Date().toISOString().split('T')[0];
        let membership_status = true;
        let role = 'New_Member'
        
        sequelize.query(`INSERT INTO members (first_name, last_name, date_of_birth, address, date_joined, role, membership_status, email, phone_number)
        VALUES (:first_name, :last_name, :date_of_birth, :address, :date_joined, :role, :membership_status, :email, :phone_number)`, {
          replacements: {
            first_name: fname,
            last_name: lname,
            date_of_birth: dob,
            address: address,
            date_joined: date_joined,
            role: role,
            membership_status: membership_status,
            email: email,
            phone_number: number
,          }
        })
        .then(() => {
          console.log('New member created!')
          res.status(200).json({message: "New member created"})
        })
        .catch(err => {
          console.log('Error creating new member', err)
          res.status(500).json({error: "Error creating new member"})
        })
      },

      authenticateMember: (req, res) => {
        let { email } = req.body;
    
        sequelize.query("SELECT * FROM members WHERE email = :email", {
          replacements: { email },
          type: sequelize.QueryTypes.SELECT,
        })
        .then((data) => {
          if (data.length > 0) {
            console.log('Member authenticated!')
            res.json({status: "Authenticated", memberId: data[0].member_id})
          } else {
            res.json({status: "Email not found"})
          }
        })
        .catch((err) => {
          console.log("Error authenticating user", err)
          res.sendStatus(500)
        })
    },

      checkAuthentication: (req, res, next) => {
        const memberId = req.headers['x-member-id'];

        sequelize.query("SELECT * FROM members WHERE member_id = :memberId", {
          replacements: { memberId },
          type: sequelize.QueryTypes.SELECT,
        })
        .then((data) => {
          if (data.length > 0) {
            next();
          } else {
            res.status(401).json({status: "Not authenticated"})
          }
        })
        .catch((err) => {
          console.log("Error checking authentication", err)
          res.sendStatus(500)
        })
      },

      Event,

      getEvents: async (req, res) => {
        try {
          const events = await Event.findAll({
            include: [
              {
                model: Member,
                attributes: ['first_name']
              },
            ],
          });
          res.json(events);
          console.log(events)
      } catch (err) {
          console.log(err);
          res.status(500).send('An error occurred while fetching events');
      }
    },

    createEvent: (req, res) => {
      let {eName, eDate, location, capacity, isActive, eText} = req.body;
      console.log(req.body);

      eDate = eDate === "" ? null : eDate;
      location = location === "" ? null : location;
      capacity = capacity === "" ? null : capacity;
      eText = eText === "" ? null : eText;

      let event_creation_date = new Date().toISOString().split('T')[0];
      let host_id = req.headers['x-member-id'];
      let member_guests = 0;

      sequelize.query(`INSERT INTO events (event_name, event_date, event_creation_date, host_id, location, member_guests, maximum_capacity, is_active, event_text)
      VALUES (:event_name, :event_date, :event_creation_date, :host_id, :location, :member_guests, :maximum_capacity, :is_active, :event_text)`, {
        replacements: {
          event_name: eName,
          event_date: eDate,
          event_creation_date: event_creation_date,
          host_id: host_id, 
          location: location, 
          member_guests: member_guests,
          maximum_capacity: capacity,
          is_active: isActive,
          event_text: eText
        }
      })
        .then(() => {
          console.log('New event created!')
          res.status(200).json({message: "New event created"})
        })
        .catch(err => {
          console.log('Error creating new event', err)
          res.status(500).json({error: "Error creating new event"})
        })
    },

    updateAttendance: async (req, res) => {
      let { memberId, eventId, status } = req.body;

      try {
        let attendance = await Attendance.findOne({
          where: { member_id: memberId, event_id: eventId}
        });

        if ((attendance === null || !attendance.status) && status) {
          let event = await Event.findOne({ where: { event_id: eventId } })
          event.increment('member_guests')
        }

        if (attendance && attendance.status && !status) {
          let event = await Event.findOne({ where: { event_id: eventId } })
          event.decrement('member_guests')
        }

        await Attendance.upsert({ member_id: memberId, event_id: eventId, status: status })

        res.status(200).json({ message: "Attendance updated successfully" }) 
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating attendance" })
      }
    },

    deleteEvent: async (req, res) => {
      const { id } = req.params
      try {
        const result = await sequelize.models.Event.destroy({
          where: {
            event_id: id
          }
        })

        if (result !== 0) {
          res.status(200).json({
            status: 'success',
            data: {
              rows_deleted: result
            }
          })
        } else {
          res.status(404).json({
            status: 'error',
            message: 'No event found with the provided id'
          })
        }
      } catch (err) {
        console.error(err)
        res.status(500).json({
          status: 'error',
          error: err
        })
      }
    },

    Discussion,

    getDiscussions: async (req, res) => {
      try {
        const discussions = await Discussion.findAll();
        res.json(discussions);
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching discussions');
    }
  },

  createDiscussion: (req, res) => {
    let {dName, dText, isActive} = req.body;
    let date_posted = new Date().toISOString().split('T')[0];
    let author_id = req.headers['x-member-id'];

    sequelize.query(`INSERT INTO discussions (discussion_name, discussion_text, author_id, date_posted, is_active)
    VALUES (:discussion_name, :discussion_text, :author_id, :date_posted, :is_active,)`, {
      replacements: {
        discussion_name: dName,
        discussion_text: dText,
        author_id: author_id,
        date_posted: date_posted,
        is_active: isActive,
      }
    })
      .then(() => {
        console.log('New discussion created!')
        res.status(200).json({message: "New discussion created"})
      })
      .catch(err => {
        console.log('Error creating new discussion', err)
        res.status(500).json({error: "Error creating new discussion"})
      })
  },
}