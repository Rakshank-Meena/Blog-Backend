const Router = require('router')
const { user, blogs } = require('../database/model')
const router = Router()
const bcrypt = require('bcryptjs')
const authenticate = require('../middleWare/authenticate')
const { v4: uuid_v4 } = require('uuid')

router.post('/signup', async (req, res) => {
    try {
        const { email, password, cPassword, userName } = req.body
        const incomingUser = await user.findOne({ email })

        if (incomingUser) {
            res.status(403).json({ 'message': 'user already exists' })
        }
        else {
            if (password !== cPassword) {
                res.status(401).send({ 'message': "passwords do not match" })
            }
            const newUser = new user({ email, userName, password, userName, userType: 'user' })
            await newUser.save().then(() => {
                console.log('user saved successfully')
            }).catch(err => (console.log(err)))
        }
    }
    catch (err) {
        console.log(err)
    }

})

router.post('/login', async (req, res) => {
    try {
        if (req.body.reqType == "signup") {
            const { email, password, cPassword, userName } = req.body
            const incomingUser = await user.findOne({ email })

            if (incomingUser) {
                res.status(403).json({ 'message': 'user already exists' })
            }
            else {
                if (password !== cPassword) {
                    res.status(401).send({ 'message': "passwords do not match" })
                }
                const newUser = new user({ email, userName, password, userName, userType: 'user' })
                await newUser.save().then(async () => {
                    const savedUser = await user.findOne({ email })
                    if (savedUser) {
                        const _patk = incomingUser.userType == 'user' ? '0alwd' : '1alwd'
                        token = await incomingUser.generateAuthToken()

                        return res.cookie('_jwt', token, {
                            expires: new Date(Date.now() + 2892000000),
                            httpOnly: true,

                        }),
                            res.status(200).json({ user: incomingUser, _patk })
                    }

                }).catch(err => (console.log(err)))
            }
        }
        const { email, password } = req.body
        const incomingUser = await user.findOne({ email })
        if (incomingUser) {
            // const passMatch=await bcrypt.compare(password, incomingUser.password);
            if (password === incomingUser.password) {
                const _patk = incomingUser.userType == 'user' ? '0alwd' : '1alwd'
                token = await incomingUser.generateAuthToken()

                return res.cookie('_jwt', token, {
                    expires: new Date(Date.now() + 2892000000),
                    httpOnly: true,

                }),
                    res.status(200).json({ user: incomingUser, _patk })
            }
            else {
                res.status(401).json({ 'message': 'Invalid credentials' })
            }
        }
        else {
            res.status(404).json({ 'message': 'user not found' })
        }
    }
    catch (err) {
        console.log(err)
    }

})

router.get('/blogs', async (req, res) => {
    if (req.query.blogId) {
        const blog = await blogs.findOne({ blogId: req.query.blogId })
        res.status(200).json({ data: blog })
    }
    else {
        const blog = await blogs.find({})
        res.status(200).json({ data: blog })
    }
})
router.post('/blogs', authenticate, async (req, res) => {

    try {
        if (req.registeredUser) {
            const { title, content } = req.body
            const { email, userName } = req.registeredUser
            const blogId = uuid_v4()
            newBlog = new blogs({ title, content, email, userName, blogId })
            await newBlog.save().then(() => res.status(200).json({ status: 'SUCCESS' })).catch(() => res.status(403).json({ status: 'UNAUTHENTICATED REQUEST' }))
        }
    } catch (error) {
        res.status(403).send({ status: 'UNAUTHENTICATED REQUEST' })
    }

})
router.patch('/blogs', authenticate, async (req, res) => {
    try {
        if (req.registeredUser) {
            const { blogId, email, type } = req.body
            const blogEdit = await blogs.findOne({ email, blogId })
            if (type == 'comment') {
                const { comment } = req.body
                const newComments = blogEdit.comments

                newComments.unshift({ user: req.registeredUser.userName, comment })

                blogEdit.comments = newComments
                await blogEdit.save().then(() => { res.status(200).json({ blogEdit }) })
            }
            else {
                const { title, content } = req.body
                blogEdit.title = title
                blogEdit.content = content
                await blogEdit.save().then(() => { res.status(200).json({ blogEdit }) })
            }
        }
    } catch (error) {
        console.log(error)
    }
})
router.delete('/blogs', authenticate, async (req, res) => {
    try {
        if (req.registeredUser) {
            const blogId = req.query.blogId
            await blogs.findOneAndDelete({ blogId }).then((response) => {
                res.status(200).json({ "message": "SUCCESS" })
            }).catch(err => console.log(err))

        }

    } catch (error) {
        return;
    }
})
router.get('/my-blogs', async (req, res) => {
    try {
        const { email } = req.query
        await blogs.find({ email }).then((blogList) => { res.status(200).json({ data: blogList }) }).catch((error) => { res.status(404).send({ error: 'NOT FOUND' }) })

    } catch (error) {
        console.log(error)
    }
})
router.post('/blog-comment', authenticate, async (req, res) => {
    try {

    } catch (error) {

    }
})
module.exports = router