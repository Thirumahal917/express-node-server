const express = require('express')
require('./mongoose')
const User = require('./models/users')

const app = express()

const port = Number(process.env.PORT) || 3000

app.use(express.json())

app.get('/users',async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users);
    } catch(error) {
        return res.status(500).send(error);
    }
})

app.get('/users/:id',async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id);
        return res.send(user);
    } catch (error) {
        return res.status(500).send(error);
    }
})

app.post('/users', async (req, res) => {
    try {
        const body = req.body;
        const user = new User(body);
        await user.save();
        return res.send({
            message: "User Created",
            user: user
        })
    } catch (error) {
        return res.status(500).send(error);
    }

    // const user = new User(req.body)
    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user) {
            return res.status(404).send()
        }

        return res.send(user)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        return res.send(user)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})