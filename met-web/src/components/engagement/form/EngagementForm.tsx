import React, { useContext, useState, useEffect } from 'react';
import { Typography, Grid, TextField, Stack } from '@mui/material';
import { MetPaper, MetLabel, PrimaryButton, SecondaryButton, MetHeader4 } from '../../common';
import RichTextEditor from './RichTextEditor';
import { ActionContext } from './ActionContext';
import { formatDate } from '../../common/dateHelper';
import ImageUpload from 'components/imageUpload';
import { useNavigate } from 'react-router-dom';
import { AddSurveyBlock } from './AddSurveyBlock';

const EngagementForm = () => {
    const {
        handleCreateEngagementRequest,
        handleUpdateEngagementRequest,
        isSaving,
        savedEngagement,
        engagementId,
        handleAddBannerImage,
    } = useContext(ActionContext);

    const navigate = useNavigate();

    const isNewEngagement = engagementId === 'create';

    const [engagementFormData, setEngagementFormData] = useState({
        name: '',
        fromDate: '',
        toDate: '',
        description: '',
        content: '',
        status_id: 0,
        status: { status_name: '' },
    });
    const [richDescription, setRichDescription] = useState('');
    const [richContent, setRichContent] = useState('');

    useEffect(() => {
        setEngagementFormData({
            name: savedEngagement?.name || '',
            fromDate: formatDate(savedEngagement.start_date),
            toDate: formatDate(savedEngagement.end_date),
            description: savedEngagement?.description || '',
            content: savedEngagement?.content || '',
            status_id: savedEngagement?.status_id || 0,
            status: savedEngagement?.engagement_status || {},
        });
        setRichDescription(savedEngagement?.rich_description || '');
        setRichContent(savedEngagement?.rich_content || '');
    }, [savedEngagement]);

    const [engagementFormError, setEngagementFormError] = useState({
        name: false,
        fromDate: false,
        toDate: false,
        description: false,
        content: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            [e.target.name]: e.target.value,
        });
        setEngagementFormError({
            ...engagementFormError,
            [e.target.name]: false,
        });
    };

    const handleDescriptionChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            description: rawText,
        });

        setEngagementFormError({
            ...engagementFormError,
            description: false,
        });
    };

    const handleContentChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            content: rawText,
        });

        setEngagementFormError({
            ...engagementFormError,
            content: false,
        });
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichDescription(newState);
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    const { name, fromDate, toDate, description, content } = engagementFormData;

    const validateForm = () => {
        const errors = {
            name: !name,
            fromDate: !fromDate,
            toDate: !toDate,
            description: !description,
            content: !content,
        };

        setEngagementFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handleCreateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = await handleCreateEngagementRequest({
            ...engagementFormData,
            richDescription: richDescription,
            richContent: richContent,
        });

        navigate(`/engagement/form/${engagement.id}`);

        return engagement;
    };

    const handleUpdateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = await handleUpdateEngagementRequest({
            ...engagementFormData,
            richDescription: richDescription,
            richContent: richContent,
        });

        navigate(`/engagement/form/${engagement.id}`);

        return engagement;
    };

    const handleSaveEngagement = () => {
        if (isNewEngagement) {
            return handleCreateEngagement();
        }

        return handleUpdateEngagement();
    };

    const handlePreviewEngagement = async () => {
        const engagement = await handleSaveEngagement();
        if (!engagement) {
            return;
        }

        navigate(`/engagement/view/${engagement.id}`);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Grid item lg={8} xs={12}>
                <MetPaper elevation={1}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        rowSpacing={2}
                        sx={{ padding: '2em' }}
                    >
                        <Grid item xs={12}>
                            <ImageUpload
                                data-testid="engagement-form/image-upload"
                                handleAddFile={handleAddBannerImage}
                                savedImageUrl={savedEngagement.banner_url}
                            />
                        </Grid>
                        <Grid item xs={12} lg={8} md={6}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Engagement Name</MetLabel>
                            <TextField
                                id="engagement-name"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="name"
                                value={name}
                                onChange={handleChange}
                                error={engagementFormError.name}
                                helperText={engagementFormError.name ? 'Name must be specified' : ''}
                            />
                        </Grid>
                        <Grid
                            item
                            lg={8}
                            xs={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="baseline"
                            rowSpacing={{ xs: 1, sm: 0 }}
                            columnSpacing={2}
                        >
                            <Grid item xs={12}>
                                <MetLabel>Engagement Date</MetLabel>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                        From
                                    </Typography>

                                    <TextField
                                        id="date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        InputProps={{ inputProps: { max: toDate || null } }}
                                        fullWidth
                                        name="fromDate"
                                        value={fromDate}
                                        onChange={handleChange}
                                        error={engagementFormError.fromDate}
                                        helperText={engagementFormError.fromDate ? 'From Date must be specified' : ''}
                                    />
                                </Stack>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>To</Typography>

                                    <TextField
                                        id="date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        InputProps={{ inputProps: { min: fromDate || null } }}
                                        fullWidth
                                        name="toDate"
                                        value={toDate}
                                        onChange={handleChange}
                                        error={engagementFormError.toDate}
                                        helperText={engagementFormError.toDate ? 'To Date must be specified' : ''}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Engagement Description</MetLabel>
                            <RichTextEditor
                                setRawText={handleDescriptionChange}
                                handleEditorStateChange={handleRichDescriptionChange}
                                initialRawEditorState={savedEngagement.rich_description || ''}
                                error={engagementFormError.description}
                                helperText="Description cannot be empty"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <MetHeader4 sx={{ marginBottom: '2px', fontWeight: 'bold' }}>Content Block</MetHeader4>
                            <MetPaper>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={2}
                                    sx={{ padding: '1em' }}
                                >
                                    <Grid item xs={12}>
                                        <MetLabel sx={{ marginBottom: '2px' }}>Engagement Content</MetLabel>
                                        <RichTextEditor
                                            setRawText={handleContentChange}
                                            handleEditorStateChange={handleRichContentChange}
                                            initialRawEditorState={savedEngagement.rich_content || ''}
                                            error={engagementFormError.content}
                                            helperText="Content cannot be empty"
                                        />
                                    </Grid>
                                </Grid>
                            </MetPaper>
                        </Grid>

                        <Grid item xs={12}>
                            <AddSurveyBlock />
                        </Grid>

                        <Grid item xs={12}>
                            {isNewEngagement ? (
                                <PrimaryButton
                                    sx={{ marginRight: 1 }}
                                    data-testid="engagement-form/create-engagement-button"
                                    onClick={() => handleCreateEngagement()}
                                    loading={isSaving}
                                >
                                    Create Engagement Draft
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                    data-testid="engagement-form/update-engagement-button"
                                    sx={{ marginRight: 1 }}
                                    onClick={() => handleUpdateEngagement()}
                                    disabled={isSaving}
                                    loading={isSaving}
                                >
                                    Update Engagement
                                </PrimaryButton>
                            )}
                            <SecondaryButton
                                data-testid="engagement-form/preview-engagement-button"
                                onClick={() => handlePreviewEngagement()}
                                disabled={isSaving}
                            >
                                {'Save & Preview Engagement'}
                            </SecondaryButton>
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>
    );
};

export default EngagementForm;
