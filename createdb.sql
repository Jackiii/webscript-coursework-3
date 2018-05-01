--drop database if exists ws_cwk_3; testing purposes.

create database if not exists ws_cwk_3;

create table if not exists ws_cwk_3.Unit (
    unitName varchar(40) primary key unique
);

create table if not exists ws_cwk_3.Session (
  sessId int primary key auto_increment,
  unitName varchar(40) not null,
  sessWeek int(2),
  sessType varchar(10),
  sessCoord varchar(30),
  sessTopic varchar(50),
  sessDesc varchar(1000),
  sessHmwk varchar(300),
  sessDate date
);