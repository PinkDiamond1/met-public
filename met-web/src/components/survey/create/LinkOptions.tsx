import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Stack, Autocomplete } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { fetchSurveys, linkSurvey } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Survey } from 'models/survey';

const LinkOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [loadingSurveys, setLoadingSurveys] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { availableSurveys, setAvailableSurveys, engagementToLink } = useContext(CreateSurveyContext);

    const handleFetchSurveys = async () => {
        if (!!availableSurveys) {
            setLoadingSurveys(false);
            return;
        }

        try {
            const fetchedSurveys = await fetchSurveys({
                unlinked: true,
            });
            setAvailableSurveys(fetchedSurveys);
            setLoadingSurveys(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };

    useEffect(() => {
        handleFetchSurveys();
    }, [availableSurveys]);

    const handleSave = async () => {
        if (!selectedSurvey) {
            dispatch(openNotification({ severity: 'error', text: 'Please select a survey first' }));
            return;
        }

        if (!engagementToLink) {
            dispatch(openNotification({ severity: 'error', text: 'Failed to get the related engagement information' }));
            return;
        }

        setIsSaving(true);

        try {
            await linkSurvey({
                id: String(selectedSurvey.id),
                engagement_id: String(engagementToLink.id),
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `Survey ${selectedSurvey.name} was successfully added to engagement ${engagementToLink.name}`,
                }),
            );
            navigate(`/engagement/form/${engagementToLink.id}`);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Failed to link survey to engagement' }));
            setIsSaving(false);
        }
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={6}>
                <MetLabel sx={{ marginBottom: '2px' }}>Select Survey</MetLabel>
                <Autocomplete
                    id="survey-selector"
                    options={availableSurveys || []}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                        />
                    )}
                    getOptionLabel={(survey: Survey) => survey.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, survey: Survey | null) =>
                        setSelectedSurvey(survey)
                    }
                    disabled={loadingSurveys}
                />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton onClick={handleSave} loading={isSaving}>
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default LinkOptions;
