import { userModel } from "./models/userModel.js"


export const findOne = async ({model , filter , select='' , options={} })=>{

    const query = model.findOne(filter)

    if(options.populate){
        query.populate(options.populate)
    }
    if(options.lean){
        query.lean()
    }
     if(select.select){
        query.select(select)
    }
    
    const doc =await query
    return doc
}


export const findById = async ({model , id , select='' , options={} })=>{

    const query = model.findById(id)

    if(options.populate){
        query.populate(options.populate)
    }
    if(options.lean){
        query.lean()
    }
     if(select.select){
        query.select(select)
    }
    
    const doc =await query
    return doc
}



export const findByEmail = async ({email , select='' , options={} })=>{

    const doc = await findOne({
        model:userModel,
        filter:{
            email
        },
        select,
        options
    })

    return doc
}



export const find = async ({model , filter ={} , select='' , options={} })=>{

    const query = model.find(filter)

    if(options.populate){
        query.populate(options.populate)
    }
    if(options.lean){
        query.lean()
    }
    if(select.select){
        query.select(select)
    }
    
    const doc =await query
    return doc
}



export const create = async ({model , data , options= {validateBeforeSave:true} })=>{

    const docs =await model.create(Array.isArray(data)?data:[data] , options)    
    return Array.isArray(data)? docs : docs[0]
}



