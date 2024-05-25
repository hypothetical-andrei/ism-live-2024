import mongoose from 'mongoose'

// mongosh -u root -p ism -authenticationDatabase admin
await mongoose.connect('mongodb://root:ism@localhost:27017/datalegacy?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UserSchema = new mongoose.Schema({
  name: String
})

const ResourceSchema = new mongoose.Schema({
  content: String,
  enabled: Boolean,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const ResourceVersionSchema = new mongoose.Schema({
  resourceId:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  },
  previousVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResourceVersion'
  },
  operation: String,
  performedByL: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

ResourceSchema.pre('save', async function () {
  const resource = this
  if (resource.isNew) {
    // creation
    resource.enabled = true
    resource.createdBy = resource.$$user
  } else {
    let previousVersion
    if (resource.enabled === true) {
      // update
      previousVersion = new ResourceVersion({
        resourceId: resource._id,
        operation: 'update',
        performedBy: resource.$$user
      })
    } else {
      // deletion
      previousVersion = new ResourceVersion({
        resourceId: resource._id,
        operation: 'delete',
        performedBy: resource.$$user
      })
    }
    await previousVersion.save()
  }
})

const User = mongoose.model('User', UserSchema)
const Resource = mongoose.model('Resource', ResourceSchema)
const ResourceVersion = mongoose.model('ResourceVersion', ResourceVersionSchema)

const user = new User({ name: 'jim' })
await user.save()

const resource = new Resource({ content: 'some content' , $$user: user._id })
await resource.save()

resource.content = 'Updated content'
resource.$$user = user._id
await resource.save()

resource.content = 'Updated content'
resource.enabled = false
resource.$$user = user._id
await resource.save()

await mongoose.disconnect()
