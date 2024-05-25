import Sequelize from 'sequelize'

const Op = Sequelize.Op

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'ism',
  database: 'ismv4',
  define: {
    timestamps: false
  }
})

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  openingHour: {
    type: Sequelize.TIME,
    allowNull: false
  },
  closingHour: {
    type: Sequelize.TIME,
    allowNull: false
  }
})

const Location = sequelize.define('Location', {
  street: {
    type: Sequelize.STRING,
    allowNull: false
  },
  number: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const Menu = sequelize.define('Menu', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const MenuItem = sequelize.define('MenuItem', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
})

Restaurant.hasMany(Location, { onDelete: 'cascade' })
Location.belongsTo(Restaurant)

Restaurant.hasOne(Menu)
Menu.belongsTo(Restaurant)

Menu.belongsToMany(MenuItem, { through: 'MenuItemMapping' })
MenuItem.belongsToMany(Menu, { through: 'MenuItemMapping' })

try {
  await sequelize.sync({ force: true })
  const restaurant1 = await Restaurant.create({ 
    name: 'Restaurant 1', 
    openingHour: '10:00', 
    closingHour: '22:00' 
  })
  const restaurant2 = await Restaurant.create({ 
    name: 'Restaurant 2', 
    openingHour: '11:00', 
    closingHour: '23:00' 
  })
  const location1 = await Location.create({
    street: 'street 1',
    number: '12',
    city: 'New York'
  })
  const location2 = await Location.create({
    street: 'street 23',
    number: '122',
    city: 'New York'
  })
  await restaurant1.addLocation(location1)
  await restaurant2.addLocation(location2)

  const menu1 = await Menu.create({
    description: 'Restaurant 1 menu'
  })
  const menu2 = await Menu.create({
    description: 'Restaurant 2 menu'
  })
  
  await restaurant1.setMenu(menu1)
  await restaurant2.setMenu(menu2)

  const menuItem11 = await MenuItem.create({
    description: 'item 11',
    price: 10.99
  })
  const menuItem12 = await MenuItem.create({
    description: 'item 12',
    price: 8.99
  })
  const menuItem21 = await MenuItem.create({
    description: 'item 21',
    price: 4.99
  })
  const menuItem22 = await MenuItem.create({
    description: 'item 22',
    price: 14.99
  })

  await menu1.addMenuItem([menuItem11, menuItem12])
  await menu2.addMenuItem([menuItem21, menuItem22])

  const sharedMenuItem = await MenuItem.create({
    description: 'shared item',
    price: 20.99
  })

  await menu1.addMenuItem(sharedMenuItem)
  await menu2.addMenuItem(sharedMenuItem)

  const location3 = await Location.create({
    street: 'a',
    number: '3c',
    city: 'Houston'
  })

  await restaurant1.addLocation(location3)
  await restaurant1.removeLocation(location3)

  await location3.destroy()
  // await restaurant1.destroy()

  let results = await Restaurant.findAll({
    where: {
      [Op.or]: {
        id: {
          [Op.gt]: 1
        },
        name: 'Restaurant 1'
      }
    },
    attributes: ['name'],
    include: [{
      model: Menu,
      include: [{
        model: MenuItem
      }]
    }],
    raw: true
  })
  console.log(results)

} catch (error) {
  console.warn(error)
} finally {
  await sequelize.close()
}