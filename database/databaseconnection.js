const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.url).then(()=>{
    console.log('database connection successful'
    );
});
