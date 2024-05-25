import mongoose, { mongo } from 'mongoose'

const url = 'mongodb://root:ism@127.0.0.1:27017/ism?maxPoolSize=20&w=majority&authSource=admin'

const LocationSchema = new mongoose.Schema({
  street: String,
  number: Number,
  city: String
})

const MenuItemSchema = new mongoose.Schema({
  description: String,
  price: Number
})

const MenuSchema = new mongoose.Schema({
  description: String,
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
})

const RestaurantSchema = new mongoose.Schema({
  name: String,
  openingHour: String,
  closingHour: String,
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }
})

const Location = mongoose.model('Location', LocationSchema)
const MenuItem = mongoose.model('MenuItem', MenuItemSchema)
const Menu = mongoose.model('Menu', MenuSchema)
const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

try {
  await mongoose.connect(url, { useNewUrlParser: true })
  // let restaurant1 = new Restaurant({
  //   name: 'restaurant1',
  //   openingHour: '10:00',
  //   closingHour: '22:00',
  //   locations: [],
  //   menu: null
  // })

  // let restaurant2 = new Restaurant({
  //   name: 'restaurant2',
  //   openingHour: '11:00',
  //   closingHour: '23:00',
  //   locations: [],
  //   menu: null
  // })

  // const location1 = new Location({
  //   street: 'str1',
  //   number: 2,
  //   city: 'New York'
  // })

  // const location2 = new Location({
  //   street: 'str2',
  //   number: 4,
  //   city: 'New York'
  // })

  // await location1.save()
  // await location2.save()


  
  // const menu1 = new Menu({
  //   description: 'menu1',
  //   items: []
  // })

  // const menu2 = new Menu({
  //   description: 'menu2',
  //   items: []
  // })

  // const menuItem11 = new MenuItem({
  //   description: 'menu item 11',
  //   price: 2.99
  // })

  // const menuItem12 = new MenuItem({
  //   description: 'menu item 12',
  //   price: 3.99
  // })
  // const menuItem21 = new MenuItem({
  //   description: 'menu item 21',
  //   price: 5.99
  // })
  // const menuItem22 = new MenuItem({
  //   description: 'menu item 22',
  //   price: 1.99
  // })

  // await menuItem11.save()
  // await menuItem12.save()
  // await menuItem21.save()
  // await menuItem22.save()
  

  // menu1.items.push(menuItem11, menuItem12)
  // menu2.items.push(menuItem21, menuItem22)
  // await menu1.save()
  // await menu2.save()


  // restaurant1.locations.push(location1)
  // restaurant2.locations.push(location2)
  // restaurant1.menu = menu1
  // restaurant2.menu = menu2
  // await restaurant1.save()
  // await restaurant2.save()

  // let restaurant1 = await Restaurant.findOne({ name: 'restaurant1' }).populate({ path: 'menu', populate: { path: 'items' } })
  // console.log(JSON.stringify(restaurant1, null, 2))
  // let additionalLocation = new Location({
  //   street: 'nowhere',
  //   number: 0,
  //   city: 'Nowhere'
  // })
  // await additionalLocation.save()
  // restaurant1.locations.push(additionalLocation)

  // await Restaurant.updateMany({}, {$pull: { locations: additionalLocation._id }})
  // await Location.findByIdAndDelete(additionalLocation._id)

  const pipeline = [
  //   {
  //   $match: {
  //     name: 'restaurant1'
  //   }
  // }, 
  {
    $lookup: {
      from: 'menus',
      localField: 'menu',
      foreignField: '_id',
      as: 'menu'
    }
  }, {
    $unwind: '$menu'
  }, {
    $lookup: {
      from: 'menuitems',
      localField: 'menu.items',
      foreignField: '_id',
      as: 'items'
    }
  }, {
    $project: {
      _id: 0,
      items: 1
    }
  }, {
    $facet: {
      data: [
        {
          $unwind: '$items'
        },
        {
          $replaceRoot: { 
            newRoot: '$items' 
          }
        }, {
          $skip: 2
        }, {
          $limit: 2
        }
      ],
      count: [
        {
          $group: {
            _id: null, 
            count: {
              $sum: {
                $size: '$items'
              }
            }
          }
        }, {
          $project: {
            _id: 0
          }
        }
      ]
    }
  }]

  const result = await Restaurant.aggregate(pipeline)
  console.log(JSON.stringify(result, null, 2))

} catch (error) {
  console.warn(error)
} finally {
  await mongoose.disconnect()
}