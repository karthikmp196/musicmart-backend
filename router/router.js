const express = require('express')
const userController = require("../controller/userController")
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const jwtAuthorization = require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/multerMiddleware')
const paymentController = require('../controller/paymentController')
const router = new express.Router()

router.post('/user/register',userController.register)
router.post('/user/login',userController.login)
router.post('/user/googleRegister',userController.googleRegister)
router.post('/admin/addproduct',jwtAuthorization,multerConfig.single('pimage') ,productController.addProduct)
router.get('/admin/showproduct',productController.showProduct)
router.put('/admin/editProduct/:id',jwtAuthorization,multerConfig.single('productimage'),productController.editProduct)
router.delete('/admin/deleteProduct/:id',jwtAuthorization,productController.deleteProduct)
router.post('/user/addToCart/:uid',jwtAuthorization,cartController.addToCart)
router.get('/user/getFromCart/:uid',jwtAuthorization,cartController.getFromCart)
router.post('/user/removeFromCart/:uid',jwtAuthorization,cartController.removeFromCart)
router.post('/user/order/:uid',jwtAuthorization,orderController.orderProducts)
router.post('/orders',paymentController.order)
router.get('/admin/showorder',orderController.getorder)
router.get('/user/showorder/:uid',orderController.getuserorder)
router.delete('/user/deleteProduct/:id',jwtAuthorization,cartController.deleteProduct)

// forget password
router.post('/user/forget-password',userController.forgetPasswordController)

//save password
router.post('/user/updatePassword',userController.savePassword)

//registered users
router.get('/admin/showUsers',userController.showUsers )

//edit profile
router.put('/user/editProfile/:id',jwtAuthorization,multerConfig.single('profileimg'),userController.editProfile)



module.exports = router