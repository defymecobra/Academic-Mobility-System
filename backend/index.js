const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://defymecobra:htghjr20102005@amsdb.ooju3.mongodb.net/AMSDB")

app.get("/", (req, res) => {
    res.send("Express app is running");
});

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('program'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

const letterStorage = multer.diskStorage({
    destination: './upload/letters',
    filename: (req, file, cb) => {
        return cb(null, `${file.originalname}`);
    }
});

const uploadLetter = multer({ storage: letterStorage });

app.use('/letters', express.static('upload/letters'));

app.post("/uploadletter", uploadLetter.single('letter'), (req, res) => {
    res.json({
        success: 1,
        letter_url: `http://localhost:${port}/letters/${req.file.filename}`
    });
});

const Program = mongoose.model("Program", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    participants: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

app.post('/addprogram', async (req, res) => {
    let programs = await Program.find({});
    let id;
    if (programs.length > 0) {
        let last_program_array = programs.slice(-1);
        let last_program = last_program_array[0];
        id = last_program.id + 1;
    }
    else {
        id = 1;
    }
    const program = new Program({
        id: id,
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        participants: req.body.participants,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });
    console.log(program);
    await program.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    });
});

app.post('/removeprogram', async (req, res) => {
    await Program.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    });
});

app.get('/allprograms', async (req, res) => {
    let programs = await Program.find({});
    console.log("All Programs Fetched");
    res.send(programs);
});

app.get('/getprogram/:programName', async (req, res) => {
    const programName = req.params.programName;

    try {
        const program = await Program.findOne({ name: programName });

        if (!program) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        console.log("Program Found", program);
        res.json({
            success: true,
            programImage: program.image,
            programName: program.name,
            programStartDate: program.startDate,
            programEndDate: program.endDate
        });
    } catch (error) {
        console.error("Error fetching program name:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get('/getprogramId/:programId', async (req, res) => {
    const programId = req.params.programId;

    try {
        const program = await Program.findOne({ id: programId });

        if (!program) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        console.log("Program Found", program);
        res.json({
            success: true,
            programImage: program.image,
            programName: program.name,
            programStartDate: program.startDate,
            programEndDate: program.endDate
        });
    } catch (error) {
        console.error("Error fetching program name:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get('/popular', async (req, res) => {
    try {
        const programs = await Program.find({})
            .sort({ participants: -1 })
            .limit(8);

        res.json({
            success: true,
            data: programs
        });
    } catch (error) {
        console.error("Error fetching sorted programs:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const Users = mongoose.model('Users', {
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, error: "Existing user found with same email address!" });
    }
    const user = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ succes: false, error: "Incorrect password!" });
        }
    }
    else {
        res.json({ succes: false, error: "Incorrect email!" });
    }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom')
            req.user = data.user;
            next();
        }
        catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
    }
}

app.post('/getprofile', fetchUser, async (req, res) => {
    console.log("GetProfile");
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData);
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/updateprofile', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({ success: true, message: "Profile updated successfully!", user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getprofileapplications', async (req, res) => {
    console.log("GetApplications");
    try {
        if (!req.body.email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        let appData = await ApplicationForm.find({ email: req.body.email });

        if (!appData || appData.length === 0) {
            return res.status(404).json({ success: false, message: "No applications found" });
        }

        res.json({ success: true, data: appData });
    } catch (error) {
        console.error("Error fetching applications data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/removeuser', async (req, res) => {
    const { email } = req.body;

    try {
        const deletedUser = await Users.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("User Removed:", deletedUser);
        res.json({
            success: true,
            message: "User successfully removed",
        });
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get('/allusers', async (req, res) => {
    let users = await Users.find({});
    console.log("All Programs Fetched");
    res.send(users);
});

const ApplicationForm = mongoose.model('ApplicationForm', {
    id: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    motivationLetter: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

app.post('/addapplication', async (req, res) => {
    let apps = await ApplicationForm.find({});
    let id;
    if (apps.length > 0) {
        let last_app_array = apps.slice(-1);
        let last_app = last_app_array[0];
        id = last_app.id + 1;
    }
    else {
        id = 1;
    }
    const app = new ApplicationForm({
        id: id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        university: req.body.university,
        program: req.body.program,
        motivationLetter: req.body.motivationLetter,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
    });
    console.log(app);
    await app.save();
    console.log("Saved");
    const programName = app.program;
    const program = await Program.findOne({ name: programName });
    if (!program) {
        return res.status(404).json({ success: false, message: "Program not found" });
    }
    program.participants += 1;
    await program.save();
    console.log("Participants Updated for Program:", programName, "Count:", program.participants);
    res.json({
        success: true,
        status: req.body.status,
    });
});

app.post('/acceptapp', async (req, res) => {
    const appId = req.body.id;

    try {
        const updatedApp = await ApplicationForm.findOneAndUpdate(
            { id: appId },
            { status: "Accepted" },
            { new: true }
        );

        if (!updatedApp) {
            return res.status(404).json({ success: false, message: "Application form not found" });
        }

        console.log("App Accepted", updatedApp);

        res.json({
            success: true,
            app: updatedApp
        });
    } catch (error) {
        console.error("Error accepting application form:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/rejectapp', async (req, res) => {
    const appId = req.body.id;

    try {
        const updatedApp = await ApplicationForm.findOneAndUpdate(
            { id: appId },
            { status: "Rejected" },
            { new: true }
        );

        if (!updatedApp) {
            return res.status(404).json({ success: false, message: "Application form not found" });
        }

        const programName = updatedApp.program;
        const program = await Program.findOne({ name: programName });

        if (!program) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        if (program.participants > 0) {
            program.participants -= 1;
            await program.save();
        }

        console.log("App Rejected", updatedApp);
        console.log("Participants Updated for Program:", programName, "Count:", program.participants);

        res.json({
            success: true,
            app: updatedApp,
            program: {
                name: program.name,
                participants: program.participants,
            }
        });
    } catch (error) {
        console.error("Error rejecting application form:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/removeapplication', async (req, res) => {
    await ApplicationForm.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    });
});

app.get('/allapplications', async (req, res) => {
    let apps = await ApplicationForm.find({});
    console.log("All Application Forms Fetched");
    res.send(apps);
});

const server = app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port: " + port);
    } else {
        console.log("Error: " + error);
    }
});

module.exports = { app, server };