#!/bin/sh
sequelize model:create --name User --attributes id:integer,email:string,password:string,details:string,created_at:date,deleted_at:date
sequelize model:create --name Product --attributes id:integer,title:string,price:numeric,created_at:date,deleted_at:date,tags:string
sequelize model:create --name PurchaseItem --attributes id:integer,purchaseId:integer,productId:integer,price:float,quantity:integer,state:string
sequelize model:create --name Purchase --attributes id:integer,name:string,address:string,state:string,zipcode:integer,userId:integer

sequelize seed:create --name user-seeder
sequelize seed:create --name product-seeder
