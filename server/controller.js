require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
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
        drop table if exists users;
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
	        email varchar(30),
	        phone_number varchar(20)
        );

        create table events (
          event_id serial primary key,
          event_name varchar(30),
          event_date date,
          event_creation_date date,
          location varchar(50),
          host_id int *> members.member_id,
          member_guests int null,
          maximum_capacity int,
          status varchar(20)
        );

        create table discussion (
          discussion_id serial primary key,
	        discussion_name varchar(30),
	        discussion_text text,
	        author_id int *> members.member_id,
	        date_posted date,
	        is_active boolean
        );

        create table comments (
          comment_id serial primary key,
          author_id int *> members.member_id,
          discussion_id int *> discussions.discussion_id,
          comment text,
          date_posted date,
          is_active boolean
        );

        insert into members (first_name, last_name, date_of_birth, address, date_joined, role, membership_status, email, phone_number),
        values ('Doris', 'the Ugly Stepsister', '1959-05-23', '3284, Evil Lane, Far Far Away', '2004-05-19','Kitchen Manager', true, 'UglyStepsisterIsMe@yahoo.com', '(746) 485-4846'),
        ('Gingy', NULL, '1980-02-28', NULL, '2001-05-18', 'Online Advocate', true, 'DeliciousCookie@AOL.com', '(395) 724-2986'),
        ('Pinocchio', NULL, '1886-10-30', NULL, 2001-05-18', 'Carpenter', true, 'DisIzAcktualyMiEmayl4Rel@YourNigerianPrice.org', '(275) 824-1084'); 
      `).then(() => {
          console.log('DB seeded!')
          res.sendStatus(200)
      }).catch(err => console.log('error seeding DB', err))
      }
  }
