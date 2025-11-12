import cron from 'node-cron'
import { Offer } from '../models/offerSchema.js'


cron.schedule("* * * * *",async () =>{

    try {
        const now = Date.now();

        await Offer.updateMany(
            {startDate : {$lte : now} , endDate : {$gte : now} , publish : false},
            {$set : { publish: true }}
        )

        await Offer.updateMany (
            {endDate : {$lt : now}, publish : true},
            {$set : {publish : false}}
        )
        // console.log("Offer status auto-updated at:", now.toLocaleString());
    } catch (error) {
        console.error("Error in offer scheduler:", error);
    }


})