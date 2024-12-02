import { mutation, query } from "./_generated/server";
import {v} from "convex/values";

export const createUser=mutation({
    args:{
        userName:v.string(),
        email:v.string(),
        imageUrl:v.string()

    },
    handler:async(ctx,arg)=>{
        //if user exist
        const user=await ctx.db.query('users')
        .filter((q)=>q.eq(q.field('email'),arg.email))
        .collect();
        if(user?.length==0)
        {
            await ctx.db.insert('users',{
                email:arg.email,
                userName:arg.userName,
                imageUrl:arg.imageUrl,
                upgrade:false
            });
            return'Inserted New User'
        }
        //if not inser new user
        return'User alreeady Exist !'

    }
})
export const userUpgradePlan=mutation({
    args:{
        userEmail:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args.userEmail)).collect();
        
        if(result)
        {
            await ctx.db.patch(result[0]._id,{upgrade:true});
            return 'success'
        }
        return 'error'
    }
})
export const GetUserInfo=query({
    args:{
        userEmail:v.optional( v.string())
    },
    handler:async(ctx,args)=>{
        if(!args.userEmail)
        {
            return ;
        }
        const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();
        return result[0];
    }
})