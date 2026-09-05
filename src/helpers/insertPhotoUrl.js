const cloudinary=require('./cloudinaryConfig');

const insertPhotoUrl=async (file)=>{
        if (file) {
          const fileBuffer = file.buffer.toString('base64');
          const dataURI = `data:${file.mimetype};base64,${fileBuffer}`;
          
          try {
            const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
              folder: 'user_profiles',
            });
            
            return cloudinaryResponse.secure_url;
          } catch (cloudErr) {
            throw new Error(
              "Cloudinary image upload failed (HTTP 403: Invalid or expired Cloudinary API credentials in backend .env). Please provide valid Cloudinary API keys or use a Photo URL instead."
            );
          }
        }
}

module.exports=insertPhotoUrl;