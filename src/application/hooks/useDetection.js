import { useState } from 'react';
import { detectionService } from '../../infrastructure/services/detectionService';
import { ContentType } from '../../domain/enums';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const useDetection = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const user = useAuthStore(state => state.user);
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'; // Default GUID if not found

    const detectText = async (text) => {
        setLoading(true);
        setError(null);
        try {
            if (!text?.trim()) throw new Error('Please enter some text.');
            
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('contentType', ContentType.Text);
            formData.append('textContent', text);

            const data = await detectionService.detect(formData);
            setResult(data);
            return data;
        } catch (err) {
            const lang = useSettingsStore.getState().lang;
            const errMsg = lang === 'ar' && err.response?.data?.messageAr
                ? err.response.data.messageAr
                : (err.response?.data?.message || err.message || 'Detection failed.');
            setError(errMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const detectFile = async (file) => {
        setLoading(true);
        setError(null);
        try {
            if (!file) throw new Error('Please upload a file.');
            let contentType = ContentType.Video; // Default to video if not image or audio
            if (file.type.startsWith('image/')) contentType = ContentType.Image;
            else if (file.type.startsWith('audio/')) contentType = ContentType.Audio;
            else if (file.type.startsWith('video/')) contentType = ContentType.Video;

            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('contentType', contentType);
            formData.append('file', file);

            const data = await detectionService.detect(formData);
            setResult(data);
            return data;
        } catch (err) {
            const lang = useSettingsStore.getState().lang;
            const errMsg = lang === 'ar' && err.response?.data?.messageAr
                ? err.response.data.messageAr
                : (err.response?.data?.message || err.message || 'Detection failed.');
            setError(errMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, result, error, setResult, setError, detectText, detectFile };
};
