require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          rejectUnauthorized: false
      }
  }
})


module.exports = {
  seed: (req, res) => {
  sequelize.query(`
        drop table if exists events;
        drop table if exists discussions;
        drop table if exists comments;

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
          event_name varchar(30),
          event_date date,
          event_creation_date date,
          host_id int references members(member_id),
          location varchar(50),
          member_guests int null,
          maximum_capacity int,
          status varchar(20)
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
      `).then(() => {
          console.log('DB seeded!')
          res.sendStatus(200)
      }).catch(err => console.log('error seeding DB', err))
      },
      
      createMember: (req, res) => {
        console.log(req.body)
        const {fname, lname, dob, address, email, number} = req.body;

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
            req.session.isLoggedIn = true;
            res.json({status: "Authenticated"})
          } else {
            res.json({status: "Email not found"})
          }
        })
        .catch((err) => {
          console.log("Error authenticating user", err)
          res.sendStatus(500)
        })
      },

      logout: (req, res) => {
        req.session.isLoggedIn = false;
        res.json({status: "Logged out"})
      },

      checkAuthentication: (req, res, next) => {
        if (req.session && req.session.isLoggedIn) {
          next();
        } else {
          res.status(401).json({status: "Not authenticated"})
        }
      }
  }


  // 

  // 

  // 