import User from "../Models/userModel.js";
import admin from "../utils/Firebase.js"

export const notificationService={
     sendNotification:async(title,body,userId)=>{
        try {
            console.log(userId,"=======================")
            // const userId = req.user?.userId
          
            const user = await User.findById(userId);
            console.log(user,"---------")
            if (!user) {
              throw new Error('User or device token not found');
            }
        
            const message = {
              notification: {
                title,
                body,
              },
              token: user.deviceToken,
            };
        
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        
    }
}