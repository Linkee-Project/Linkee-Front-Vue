import axios from './axios';

export const getAlarmBoxesMe = async () => {
    try {
        const response = await axios.get('/alarm/boxes/me');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch alarm boxes:', error);
        throw error;
    }
};

export const checkAlarmBox = async (alarmBoxId) => {
    try {
        const response = await axios.patch(`/alarm/boxes/check/${alarmBoxId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to mark alarm ${alarmBoxId} as read:`, error);
        throw error;
    }
};

export const deleteAlarmBox = async (alarmBoxId) => {
    try {
        const response = await axios.delete(`/alarm/boxes/delete/${alarmBoxId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete alarm ${alarmBoxId}:`, error);
        throw error;
    }
};