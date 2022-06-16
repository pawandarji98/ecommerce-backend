const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const globalErrorHandler = require('./controllers/error-controller');
const AppError = require('./utils/app-error');
const authRouter = require('./routes/auth-router');
const storeRouter = require('./routes/store-router');
const productRouter = require('./routes/product-router');
const productCategoryRouter = require('./routes/product-category-router');
const productSubCategoryRouter = require('./routes/product-sub-category-router');
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:'http://localhost:8100'
}));

app.use(express.static(`${__dirname}/assets`));
app.use(helmet());
app.use(compression());
app.use((req , res,  next) => {
    req.date = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(201).json({
        status:'success',
        data: {
            message:'server running perfectly'
        }
    });
});

app.use('/api/v1/users' , authRouter);
app.use('/api/v1/store' , storeRouter);
app.use('/api/v1/product' , productRouter);
app.use('/api/v1/product-category' , productCategoryRouter);
app.use('/api/v1/product-sub-category' , productSubCategoryRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);
module.exports = app;