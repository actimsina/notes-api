const app = require('./app')
const port = process.env.PORT || 3005
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})