import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Stepper, Step, StepLabel, IconButton, Checkbox, FormControlLabel, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { RadioGroup, Radio } from "@mui/material";
import LocationMenu from "./LocationMenu"; // Import LocationMenu component
import { useCreatePublicationMutation } from "../state/api";

// Define a function to handle file uploads
const uploadFiles = async (files) => {
  // Ensure files is an array and not undefined
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided or files parameter is not an array");
  }

  // Perform file upload logic here, such as using FormData to send files to the server
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files[]", file);
  });

  // Make an HTTP request to upload the files
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  // Handle the response, such as extracting file URLs
  if (response.ok) {
    const data = await response.json();
    return data; // Return the file URLs or other relevant data
  } else {
    throw new Error("Failed to upload files");
  }
};

const CreatePostDialog = ({ open, onClose, algeriaCities }) => {
  // console.log("algeriaCities:", algeriaCities); // Add this line to log the algeriaCities data
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    type: "",
    domain: "",
    startDate: "",
    endDate: "",
    location: "", // Will be updated with the selected location
    photos: [], // Updated to store multiple photos
    participationOptions: [],
    allowAnonymousParticipation: false,
    repeat: "none", // Reset the repeat field
  });
  const [imageFileNames, setImageFileNames] = useState([]); // Updated to store multiple file names
  const [createPublication, { isLoading }] = useCreatePublicationMutation(); // Create the createPublication mutation hook
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
      repeat: "none", // Reset the repeat field
    });
    setImageFileNames([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert startDate and endDate strings to Date objects
    const newValue = name === "startDate" || name === "endDate" ? new Date(value).toISOString().slice(0, 16) : value;

    setPostData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;

    setSelectedFiles(files);
    // Convert files to an array
    const filesArray = [...files];

    // Check if files exist
    if (filesArray.length > 0) {
      try {
        // Upload files and get file URLs
        const fileUrls = await uploadFiles(filesArray);

        // Update the postData.photos state with the uploaded file URLs
        setPostData((prevData) => ({
          ...prevData,
          photos: fileUrls, // Update photos array with file URLs
        }));
      } catch (error) {
        console.error("Error uploading files:", error);
        // Optionally handle errors here, e.g., display an error message to the user
      }
    } else {
      console.error("No files selected");
      // Optionally handle errors here, e.g., display an error message to the user
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
      console.log("Submitting publication data:", publicationData);
      console.log("Files:", files);

      if (!files) {
        throw new Error("No files provided");
      }

      // Upload files first and get file URLs
      const fileUrls = await uploadFiles(files);
      const formattedFileName = `${fileUrls.firstFileName}`;
      console.log("🚀 ~ handleSubmit ~ fileUrls:", formattedFileName);

      // Add file URLs to the publication data
      const dataWithFiles = {
        ...publicationData,
        photos: formattedFileName,
      };

      // Create the publication using the mutation hook
      const response = await createPublication(dataWithFiles);

      console.log("Publication created:", response.data);

      resetForm(); // Optionally reset the form after successful submission
      onClose();
      // Handle success, e.g., redirect or show a success message
    } catch (error) {
      console.error("Error creating publication:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleCancel = () => {
    resetForm(); // Reset form on cancel
    onClose();
  };

  const handleLocationChange = (location) => {
    setPostData((prevData) => ({
      ...prevData,
      location: location,
    }));
  };

  const [repeat, setRepeat] = useState("none");
  // Add this function to handle repeat change
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
                    color: theme.palette.mode === "light" ? "#66bb6a" : null, // Light green in light mode
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
            <TextField label="Title" name="title" value={postData.title} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Content" name="content" value={postData.content} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
            <TextField select label="Type" name="type" value={postData.type} onChange={handleChange} fullWidth margin="normal">
              <MenuItem value="informative">Informative</MenuItem>
              <MenuItem value="poll">Poll</MenuItem>
              <MenuItem value="consultation">Consultation</MenuItem>
            </TextField>
            <TextField select label="Domain" name="domain" value={postData.domain} onChange={handleChange} fullWidth margin="normal">
              <MenuItem value="transportation">Transportation</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="healthcare">Healthcare</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <DialogContent>
              <LocationMenu locations={algeriaCities} onSelectLocation={handleLocationChange} />
            </DialogContent>

            <FormControlLabel control={<Checkbox checked={postData.allowAnonymousParticipation} onChange={handleCheckboxChange} name="allowAnonymousParticipation" />} label="Allow Anonymous Participation" />
            {postData.type === "poll" && (
              <React.Fragment>
                {postData.participationOptions.map((option, index) => (
                  <div key={index}>
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
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              multiple // Allow multiple file selection
              onChange={handleFileChange}
              style={{ display: "none" }}
              name="files[]" // Ensure the name attribute matches
            />

            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">
                Upload Photos
              </Button>
            </label>
            {imageFileNames.length > 0 && (
              <div>
                <p>Selected Photos:</p>
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
            <p>Start Date: {postData.startDate.toLocaleString()}</p>
            <p>End Date: {postData.endDate.toLocaleString()}</p>

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
