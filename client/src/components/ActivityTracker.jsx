import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const ActivityTracker = () => {
    const { user } = useAuth();

    useEffect(() => {
        const trackActivity = async () => {
            try {
                let country = localStorage.getItem('otaku_country');
                let ip = localStorage.getItem('otaku_ip');
                
                if (!country) {
                    const res = await fetch('https://ipapi.co/json/');
                    const data = await res.json();
                    country = data.country_name || 'Desconhecido';
                    ip = data.ip;
                    localStorage.setItem('otaku_country', country);
                    localStorage.setItem('otaku_ip', ip);
                }

                if (user) {
                    await API.post('/auth/ping', { userId: user._id, country });
                } else {
                    await API.post('/analytics/ping-visitor', { country, ip });
                }
            } catch (err) {
                // Tracking failure should not affect user experience
            }
        };

        trackActivity();
        const interval = setInterval(trackActivity, 3 * 60 * 1000); // Ping every 3 mins
        return () => clearInterval(interval);
    }, [user]);

    return null; // Invisible component
};

export default ActivityTracker;
