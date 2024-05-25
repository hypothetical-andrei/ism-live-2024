import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'ism',
  database: 'ismv4'
})

const Student = sequelize.define('student', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'last_name'
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'telephone',
    validate: {
      is: /^\+40\d{9}$/
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'email',
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'stud',
  timestamps: false
})

try {
  await sequelize.sync({ force: true })
  const student = new Student({
    firstName: 'Alice',
    lastName: 'Smith',
    phone: '+40111111111',
    email: 'alice@b.com'
  })
  await student.save()
  console.log('we are connected')
} catch (error) {
  console.warn(error)
} finally {
  await sequelize.close()
}