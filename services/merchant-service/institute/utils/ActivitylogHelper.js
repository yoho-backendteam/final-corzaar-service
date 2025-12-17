import axios from "axios";

export const logActivity = async (payload = {}) => {
    try {
        const { userid, actorRole, action, description } = payload;
        console.log("help", payload)
        if (!userid || !actorRole || !action) return;

        await axios.post(
            `${process.env.Activity_URL}/api/activity/add`,
            {
                userid,
                actorRole,
                action,
                description,
            }
        );
    } catch (error) {
        console.error("Activity log failed:", error.message);
    }
};
