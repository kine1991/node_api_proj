class APIFeatures {
    constructor(query,queryString){
        this.query = query
        this.queryString = queryString
    }

    filter(){
        // 1) Filtering
        let queryObj = {...this.queryString};
        let excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])

        // 1.1) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`)
        // console.log(queryStr)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
        // 2) Sorting
        if(this.queryString.sort){
            const sortQuery = this.queryString.sort.split(',').join(' ')
            // console.log(sortQuery) // -cylinder price
            this.query = this.query.sort(sortQuery)
        }  else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    limitFields(){
        // 3) Select some fields
        if(this.queryString.fields){
            const fieldsQuery = this.queryString.fields.split(',').join(' ')
            // console.log(fieldsQuery)  // brand,model,price,year,color => brand model price year color
            this.query = this.query.select(fieldsQuery) // исключаем name duration brand model price year color   _id по умолчанию включенно
        } else {
            this.query = this.query.select('-__v'); //исключаем __v
        }
        return this;
    }

   paginate(){
        // 4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        
        // if (this.queryString.page) {
        //     const numTours = await Car.countDocuments(); // countDocuments соличество документов
        //     console.log(numTours)
        //     if (skip >= numTours) throw new Error('This page does not exist');
        // }
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }


}

module.exports = APIFeatures;


// exports.getAllCars = async (req, res) => {
//     try{
//         // const cars = await Car.find({ fuelType: { $regex: "elec", $options: '-i' }})
//         // 1) Filtering
//         let queryObj = {...req.query};
//         let excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el])

//         // 1.1) Advanced filtering
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, match => `$${match}`)
//         // console.log(queryStr)
//         let query = Car.find(JSON.parse(queryStr));

//         // 2) Sorting
//         if(req.query.sort){
//             const sortQuery = req.query.sort.split(',').join(' ')
//             // console.log(sortQuery) // -cylinder price
//             query.sort(sortQuery)
//         } 

//         // 3) Select some fields
//         if(req.query.fields){
//             const fieldsQuery = req.query.fields.split(',').join(' ')
//             // console.log(fieldsQuery)  // brand,model,price,year,color => brand model price year color
//             query = query.select(fieldsQuery) // исключаем name duration brand model price year color   _id по умолчанию включенно
//         } else {
//             query = query.select('-__v'); //исключаем __v
//         }

//         // 4) Pagination
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit * 1 || 100;
//         const skip = (page - 1) * limit;
        
//         if (req.query.page) {
//             const numTours = await Car.countDocuments(); // countDocuments соличество документов
//             if (skip >= numTours) throw new Error('This page does not exist');
//         }
//         query = query.skip(skip).limit(limit);

//         const cars = await query

//         res.status(200).json({
//             status: 'success',
//             retults: cars.length,
//             data: {
//                 cars: cars
//             }
//         })
//     } catch(err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }
