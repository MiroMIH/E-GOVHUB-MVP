import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Stepper, Step, StepLabel, IconButton, Checkbox, FormControlLabel, useTheme, Tooltip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { RadioGroup, Radio } from "@mui/material";
import LocationMenu from "./LocationMenu"; // Import LocationMenu component
import { useCreatePublicationMutation } from "../state/api";

// Define a function to handle file uploads
const uploadFiles = async (files) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided or files parameter is not an array");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files[]", file);
  });

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to upload files");
  }
};

const CreatePostDialog = ({ open, onClose, algeriaCities }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    type: "",
    domain: "",
    startDate: "",
    endDate: "",
    location: "",
    photos: [],
    participationOptions: [],
    allowAnonymousParticipation: false,
    repeat: "none",
  });
  const [imageFileNames, setImageFileNames] = useState([]);
  const [createPublication, { isLoading }] = useCreatePublicationMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const steps = ["Enter post details", "Select dates", "Upload photos", "Review and submit"];

  const resetForm = () => {
    setActiveStep(0);
    setPostData({
      title: "",
      content: "",
      type: "",
      domain: "",
      startDate: "",
      endDate: "",
      location: "",
      photos: [],
      participationOptions: [],
      allowAnonymousParticipation: false,
      repeat: "none",
    });
    setImageFileNames([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "startDate" || name === "endDate" ? new Date(value).toISOString().slice(0, 16) : value;
    setPostData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    const filesArray = [...files];
    setImageFileNames(filesArray.map((file) => file.name));

    if (filesArray.length > 0) {
      try {
        const fileUrls = await uploadFiles(filesArray);
        setPostData((prevData) => ({
          ...prevData,
          photos: fileUrls,
        }));
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    } else {
      console.error("No files selected");
    }
  };

  const handleAddOption = () => {
    setPostData((prevData) => ({
      ...prevData,
      participationOptions: [...prevData.participationOptions, ""],
    }));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...postData.participationOptions];
    updatedOptions.splice(index, 1);
    setPostData((prevData) => ({
      ...prevData,
      participationOptions: updatedOptions,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...postData.participationOptions];
    updatedOptions[index] = value;
    setPostData((prevData) => ({
      ...prevData,
      participationOptions: updatedOptions,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (publicationData, files) => {
    try {
      if (!files) {
        throw new Error("No files provided");
      }

      const fileUrls = await uploadFiles(files);
      const formattedFileName = `${fileUrls.firstFileName}`;

      const dataWithFiles = {
        ...publicationData,
        photos: formattedFileName,
      };

      const response = await createPublication(dataWithFiles);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating publication:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleLocationChange = (location) => {
    setPostData((prevData) => ({
      ...prevData,
      location: location,
    }));
  };

  const [repeat, setRepeat] = useState("none");

  const handleRepeatChange = (e) => {
    setRepeat(e.target.value);
    setPostData((prevData) => ({
      ...prevData,
      repeat: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  style: {
                    color: theme.palette.mode === "light" ? "#66bb6a" : null,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <React.Fragment>
            <Tooltip title="Enter the title of your post">
              <TextField label="Title" name="title" value={postData.title} onChange={handleChange} fullWidth margin="normal" />
            </Tooltip>
            <Tooltip title="Enter the content of your post">
              <TextField label="Content" name="content" value={postData.content} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
            </Tooltip>
            <Tooltip title="Select the type of your post">
              <TextField select label="Type" name="type" value={postData.type} onChange={handleChange} fullWidth margin="normal">
                <MenuItem value="informative">Informative</MenuItem>
                <MenuItem value="poll">Poll</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
              </TextField>
            </Tooltip>
            <Tooltip title="Select the domain of your post">
              <TextField select label="Domain" name="domain" value={postData.domain} onChange={handleChange} fullWidth margin="normal">
                <MenuItem value="transportation">Transportation</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Tooltip>
            <DialogContent>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: "10px" }}>
                Select the location of your post:
              </Typography>
              <LocationMenu locations={algeriaCities} onSelectLocation={handleLocationChange} />
            </DialogContent>

            <FormControlLabel control={<Checkbox checked={postData.allowAnonymousParticipation} onChange={handleCheckboxChange} name="allowAnonymousParticipation" />} label="Allow Anonymous Participation" />
            {postData.type === "poll" && (
              <React.Fragment>
                {postData.participationOptions.map((option, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <TextField label={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} fullWidth margin="normal" />
                    <IconButton onClick={() => handleRemoveOption(index)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
                <IconButton onClick={handleAddOption}>
                  <AddIcon />
                </IconButton>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {activeStep === 1 && (
          <React.Fragment>
            <Tooltip title="Select the start date and time of your post">
              <TextField
                label="Start Date"
                name="startDate"
                type="datetime-local"
                value={postData.startDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
            <Tooltip title="Select the end date and time of your post">
              <TextField
                label="End Date"
                name="endDate"
                type="datetime-local"
                value={postData.endDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: "10px" }}>
              How often should this post repeat?
            </Typography>
            <RadioGroup name="repeat" value={repeat} onChange={handleRepeatChange} row>
              <FormControlLabel value="none" control={<Radio />} label="None" />
              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
            </RadioGroup>
          </React.Fragment>
        )}
        {activeStep === 2 && (
          <React.Fragment>
            <Tooltip title="Upload a photo for your post (only one image allowed)">
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input accept="image/*" id="contained-button-file" type="file" onChange={handleFileChange} style={{ display: "none" }} name="files[]" />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" component="span" style={{ marginBottom: "10px" }}>
                    Upload Photo
                  </Button>
                </label>
                <Typography variant="body2" color="error">
                  Limit to only one picture
                </Typography>
              </div>
            </Tooltip>
            {imageFileNames.length > 0 && (
              <div>
                <p>Selected Photo:</p>
                <ul>
                  {imageFileNames.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </React.Fragment>
        )}
        {activeStep === 3 && (
          <React.Fragment>
            <p>Title: {postData.title}</p>
            <p>Content: {postData.content}</p>
            <p>Type: {postData.type}</p>
            <p>Domain: {postData.domain}</p>
            <p>Start Date: {new Date(postData.startDate).toLocaleString()}</p>
            <p>End Date: {new Date(postData.endDate).toLocaleString()}</p>
            <p>Location: {postData.location}</p>
            {postData.allowAnonymousParticipation && <p>Allow Anonymous Participation: Yes</p>}
            {postData.type === "poll" && (
              <React.Fragment>
                <p>Participation Options:</p>
                <ul>
                  {postData.participationOptions.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </React.Fragment>
            )}
            {postData.photos.length > 0 && (
              <div>
                <p>Uploaded Photos:</p>
                {postData.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Uploaded Photo ${index + 1}`} style={{ maxWidth: "100%" }} />
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="error">
          Cancel
        </Button>
        <div>
          {activeStep !== 0 && (
            <Button onClick={handleBack} color="success">
              Back
            </Button>
          )}
          {activeStep !== steps.length - 1 ? (
            <Button onClick={handleNext} color="success">
              Next
            </Button>
          ) : (
            <Button onClick={() => handleSubmit(postData, [...selectedFiles])} color="success">
              <CheckCircleIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "#4caf50" : "#66bb6a",
                }}
              />
            </Button>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostDialog;
