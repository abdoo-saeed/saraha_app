import { userModel } from "../../DB/models/userModel.js"
import  fs  from 'fs/promises';
import path from "path";


export const profileImageService = async ({ user, path: filePath }) => {

    if (user.profileImage) {

        const oldPath = path.resolve(user.profileImage);

        try {
            await fs.access(oldPath);
            await fs.unlink(oldPath);
        } catch (error) {
            console.log("Old image not found, skipping delete");
        }

    }

    await userModel.updateOne(
        { _id: user._id },
        { profileImage: filePath }
    );

    return { data: {} };
};



export const coverImageService = async ({ user, paths }) => {

    console.log({ paths, user });

    if (user.coverImages && user.coverImages.length) {

        for (const img of user.coverImages) {

            const oldPath = path.resolve(img);

            try {
                await fs.access(oldPath);
                await fs.unlink(oldPath);
            } catch (error) {
                console.log("Old image not found, skipping delete");
            }

        }
    }

    await userModel.updateOne(
        { _id: user._id },
        { coverImages: paths }
    );

    return { data: {} }
}


export const deleteProfileImageService = async ({ user }) => {

    if (!user.profileImage) {
        throw new Error("Profile image not found");
    }

    const oldPath = path.resolve(user.profileImage);

    try {
        await fs.access(oldPath);
        await fs.unlink(oldPath);
    } catch (error) {
        console.log("Image not found on disk, skipping delete");
    }

    await userModel.updateOne(
        { _id: user._id },
        { $unset: { profileImage: 1 } }
    );

    return { data: {} };
};