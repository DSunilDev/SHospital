const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const uuid = require('uuid');
const db = require('./DATABASE/database.js');
const { ObjectId } = require('mongodb');

const server = http.createServer(app);
const io = new Server(server);
require = require('esm')(module /*, options*/);
const Webcam = require('webcam-easy');

let patientCounter = 0;
let outpatientCounter = 0; 
const now = new Date();

app.use(express.static('styles'));

app.use(express.urlencoded({extended:true}))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.get('/',async function(req,res)
{
    const doctordata=await db.getDb().collection('doctor').find().toArray();
    const surgerydata=await db.getDb().collection('surgery').find().toArray();
    const indata=await db.getDb().collection('inpatient').find().toArray();
    const outdata=await db.getDb().collection('outpatient').find().toArray();
    res.render('index',{doctorcount:doctordata.length,surgerycount:surgerydata.length,inlength:indata.length,outlength:outdata.length});
})

app.get('/doctor',function(req,res)
{
    res.render('doctor')
})

app.get('/outpatient',function(req,res)
{
    res.render('outpatient')
})

app.get('/inpatient',function(req,res)
{
    res.render('inpatient')
})

app.get('/surgery',function(req,res)
{
    res.render('surgery')
})

app.get('/lab',function(req,res)
{
    res.render('lab')
})

app.get('/medical',function(req,res)
{
    res.render('medical')
})

app.get('/help',function(req,res)
{
    res.render('help')
})

app.get('/about',function(req,res){
    res.render('about')
})

app.get('/insurance',function(req,res){
    res.render('insurance')
})

/*BroadCast*/
app.get('/broadcast', (req, res) => {
    res.render('broadcast');
  });
  
  app.get('/user-selection', (req, res) => {
    res.render('user-selection');
  });

app.post('/start-call', (req, res) => {
    const { username, purpose, selectedUser } = req.body;
    // Store username, purpose, and selectedUser in the database or any other storage mechanism
    res.redirect(`/broadcast?username=${username}&purpose=${purpose}&selectedUser=${selectedUser}`);
});

app.get('/check',function(req,res){
    res.render('webcam')
})

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room); // Join a room based on user selection
        io.to(data.room).emit('userJoined', { username: data.username });
    });

    socket.on('signal', (data) => {
        io.to(data.room).emit('signal', { signal: data.signal, username: data.username });
    });
});

app.get('/Gst',function(req,res){
    res.render('gst')
})

//Scanning Window

app.get('/scanner',function(req,res){
    res.render('scanner')
})


app.get('/GstBill',async function(req,res){
    const doctordata=await db.getDb().collection('doctor').find().toArray();
res.render('gstbill',{doctors:doctordata})
})

app.get('/PurchaseGst',function(req,res){
    res.render('purchasegst')
})

app.get('/DoctorRecord',async function(req,res)
{
    const doctordata=await db.getDb().collection('doctor').find().toArray();
    res.render('doctorrec',{doctors:doctordata,no:0});
})

app.get('/DoctorForm',function(req,res)
{
    res.render('doctorform')
})

app.get('/Medicalform',async function(req,res)
{
    const meddata=await db.getDb().collection('medicines').find().toArray();
    res.render('medicalform',{meds:meddata})
})


app.get('/AddSurgeon',function(req,res)
{
    res.render('surgeonform')
})

app.get('/AddAnesthesist',function(req,res)
{
    res.render('anesthesistform')
})


app.get('/LabBill',async function(req,res){
    const doctordata=await db.getDb().collection('doctor').find().toArray();
res.render('labbill',{doctors:doctordata})
})

app.get('/Anesthesist',async function(req,res)
{
    const adata=await db.getDb().collection('anesthesists').find().toArray();
    res.render('anesthesist',{doctors:adata,no:0})
})

app.get('/labform',async function(req,res)
{
    const doctordata=await db.getDb().collection('doctor').find().toArray();
    res.render('labform',{doctors:doctordata,no:0});
})


app.post('/addlabdata',async function(req,res)
{
    const labdata=req.body;
    const lname=labdata.lname;
    const age=labdata.Age;
    const gen=labdata.Gender;
    const ref=labdata.Reference;
    const date=labdata.date;
    
    const ldata={
        PatientName:lname,
        PatientAge:age,
        Gender:gen,
        referenceby:ref,
        Date:date
    }

    await db.getDb().collection('lab').insertOne(ldata);
    res.redirect('/LabData')
})

app.get('/addmedicine',function(req,res)
{
    res.render('addmedicine')
})

app.post('/addmedicine',async function(req,res)
{
    const medicinedata=req.body;
    const mname=medicinedata.mname;
    const note=medicinedata.Notes;

    const medicined={
        MedicineName:mname,
        Notes:note
    }

    await db.getDb().collection('medicines').insertOne(medicined);
    res.redirect('/MedData')
})

app.get('/MedData',function(req,res)
{
    res.render('datacollectedmed')
})

app.get('/medicines',async function(req,res)
{
    const medsdata=await db.getDb().collection('medicines').find().toArray();
    res.render('medicines',{meds:medsdata,no:0,num:medsdata.length})
})

app.post('/adddoctor',async function(req,res)
{
    const doctordata=req.body;
    const dname=doctordata.dname;
    const speciality=doctordata.Specialization;

    const doctors={
        doctorname:dname,
        special:speciality
    };
    
    await db.getDb().collection('doctor').insertOne(doctors);
    res.redirect('/doctor')
})

app.post('/addanesthesist',async function(req,res)
{
    const anesthesistdata=req.body;
    const anesthesistname=anesthesistdata.aname;
    const special=anesthesistdata.Specialization;

    const adata={
        Name:anesthesistname,
        Special:special
    }

    await db.getDb().collection('anesthesists').insertOne(adata);
    res.redirect('/surgery')

})

app.post('/addsurgery',async function(req,res)
{
    const surgerydata=req.body;
    const patientname=surgerydata.Name;
    const patientage=surgerydata.Age;
    const doj=surgerydata.doj;
    const dos=surgerydata.dos;
    const dod=surgerydata.dod;
    const suregonname=surgerydata.Surgeon;
    const anesthesist=surgerydata.Anesthesist;
    const d=surgerydata.Diagnosis;
    const p=surgerydata.Procedure;

    const surgeryd={
        Patientname:patientname,
        PatientAge:patientage,
        dateofjoin:doj,
        dateofsurgery:dos,
        dateofdischarge:dod,
        surgeon:suregonname,
        anesthesist:anesthesist,
        diagnosis:d,
        procedure:p
    };

    await db.getDb().collection('surgery').insertOne(surgeryd);
    res.redirect('/Surgerydata')
})

app.post('/addsurgeon',async function(req,res)
{
    const surgeondata=req.body;
    const sname=surgeondata.sname;
    const special=surgeondata.Specialization;

    const suregond={
        SurgeonName:sname,
        Specialist:special,
    }
    
    await db.getDb().collection('surgeons').insertOne(suregond);
    res.redirect('/Surgerydata')
})


app.post('/addInPatient',async function(req,res)
{
    const inpatientdata=req.body
    const pname=inpatientdata.Name;
    const page=inpatientdata.Age;
    const pguard=inpatientdata.Guardian;
    const Diagnosis=inpatientdata.Diagnosis;
    const Cons=inpatientdata.Consulted;
    const paddress=inpatientdata.Address;
    const phone=inpatientdata.ph;
    const join=inpatientdata.doj;
    const tim=inpatientdata.Time;
    const discharge=inpatientdata.dod;
    
    patientCounter++;
    const formattedCounter = patientCounter.toString().padStart(2, '0');
  
    const patientId = `IP${formattedCounter}`; 

    const selectedRelationship = inpatientdata.Relationship;

    // Set the prefix based on the selected relationship
    let prefix = '';
    if (selectedRelationship === 'son') {
      prefix = 's/o';
    } else if (selectedRelationship === 'wife') {
      prefix = 'w/o';
    } else if (selectedRelationship === 'daughter') {
      prefix = 'd/o';
    }
  
    // Combine the prefix and guardian name into a single variable
    const fullGuardianName = `${prefix} ${pguard}`;

    const inpatientd={
        PatientId: patientId,
        PatientName:pname,
        PatientAge:page,
        Guardian:fullGuardianName,
        Diagnosis:Diagnosis,
        Consulted:Cons,
        Address:paddress,
        Phonenumber:phone,
        DateOfJoin:join,
        JoinTime:tim,
        DateofDischarge:discharge
    }

    await db.getDb().collection('inpatient').insertOne(inpatientd)
    res.redirect('/IPdata')
})

app.post('/addOutPatient',async function(req,res)
{  
const outpatientdata = req.body;
const pname = outpatientdata.Name;
const page = outpatientdata.Age;
const selectedRelationship = outpatientdata.Relationship;
const Guard = outpatientdata.Guardian;
const diagnosis = outpatientdata.Diagnosis;
const cons = outpatientdata.Consulted;
const address = outpatientdata.Address;
const phon = outpatientdata.ph;
const date = outpatientdata.date;

outpatientCounter++;
const formattedCounter = outpatientCounter.toString().padStart(2, '0');

// Modified code to take only the last two digits of the year
const yearLastTwoDigits = now.getFullYear().toString().slice(-2);
const month = (now.getMonth() + 1).toString().padStart(2, '0');

// Create a Unique UHID in the format "yy-mm-01", "yy-mm-02", etc.
const uhid = `${yearLastTwoDigits}${month}${formattedCounter}`;

// Set the prefix based on the selected relationship
let prefix = '';
if (selectedRelationship === 'son') {
  prefix = 'S/o';
} else if (selectedRelationship === 'wife') {
  prefix = 'W/o';
} else if (selectedRelationship === 'daughter') {
  prefix = 'D/o';
}


// Combine the prefix and guardian name into a single variable
const fullGuardianName = `${prefix} ${Guard}`;

const outpatientd = {
  UHID: uhid,
  PatientName: pname,
  PatientAge: page,
  Guardian: fullGuardianName,
  Diagnosis: diagnosis,
  Consulted: cons,
  Address: address,
  Phonenumber: phon,
  Date: date
};

await db.getDb().collection('outpatient').insertOne(outpatientd);
res.redirect('/OPdata');
})


app.get('/InPatientRecord',async function(req,res)
{
    const inpatientdata=await db.getDb().collection('inpatient').find().toArray();
    res.render('inpatientrec',{inpatients:inpatientdata,m:0})
})

app.get('/OutPatientRecord',async function(req,res)
{ 
    const outpatientdata=await db.getDb().collection('outpatient').find().toArray();
    res.render('outpatientrec',{outpatients:outpatientdata,m:0})
})


app.get('/SurgeonRecord',async function(req,res)
{
    const surgeondata=await db.getDb().collection('surgeons').find().toArray();
    res.render('surgeons',{surgeons:surgeondata,no:0})
})

app.get('/SurgeryRecord',async function(req,res)
{
    const surgerydata=await db.getDb().collection('surgery').find().toArray();
    res.render('surgeryrec',{surgeryd:surgerydata,no:0})
})

app.get('/LabRecord',async function(req,res)
{
    const labdata=await db.getDb().collection('lab').find().toArray();
    res.render('labrec',{labs:labdata,no:0})
})

app.get('/InPatientForm',async function(req,res)
{
    const doctordata=await db.getDb().collection('doctor').find().toArray();
    res.render('inpatientform',{doctors:doctordata})
})

app.get('/IPdata',function (req,res){
    res.render('datacollectedip')
})


app.get('/OutPatientForm',async function(req,res)
{
    const doctordata=await db.getDb().collection('doctor').find().toArray();
    res.render('outpatientform',{doctors:doctordata})
})

app.get('/OPdata',function (req,res){
    res.render('datacollectedop')
})

app.get('/LabData',function(req,res)
{
    res.render('datacollectedlab')
})


app.get('/SurgeryForm',async function(req,res)
{
    const surgeondata=await db.getDb().collection('surgeons').find().toArray();
    const anesthesistdata=await db.getDb().collection('anesthesists').find().toArray();
    res.render('surgeryform',{surgeons:surgeondata,Anesthesistd:anesthesistdata})
})

app.get('/Surgerydata',function (req,res){
    res.render('datacollectedsurgery')
})

//Search Pages
app.get('/SearchPatient',function(req,res){
    res.render('searchpatient',{ searchResults: [] })
})

app.post('/SearchPatientD',async function (req, res){
    const patientNameQuery = req.body.PatientName;
    const phoneNoQuery = req.body.PhoneNo;

    const searchQuery = {};

    if (patientNameQuery) {
        searchQuery.PatientName = patientNameQuery;
      }
  
      if (phoneNoQuery) {
        searchQuery.PhoneNo = phoneNoQuery;
      }
  
    const OpResults=await db.getDb().collection('outpatient').find(searchQuery).toArray();
    const IpResults=await db.getDb().collection('inpatient').find(searchQuery).toArray();

    Promise.all([OpResults, IpResults])
    .then(([OpResults, IpResults]) => {
      const searchResults = [...OpResults, ...IpResults];
      res.render('searchpatient', { searchResults });
    })

    });


app.get('/SearchOp',function (req,res){
    res.render('searchoutpatient',{ searchResults: [] })
})

app.post('/SearchOpd',async function (req, res){
    const patientNameQuery = req.body.PatientName;
    const phoneNoQuery = req.body.Phone;

    const searchQuery = {};

    if (patientNameQuery) {
        searchQuery.PatientName = patientNameQuery;
      }
  
      if (phoneNoQuery) {
        searchQuery.Phone = phoneNoQuery;
      }
  
    const searchResults=await db.getDb().collection('outpatient').find(searchQuery).toArray();

    res.render('searchoutpatient',{searchResults})
    });


app.get('/SearchIp',function (req,res){
    res.render('searchinpatient',{ searchResults: [] })
})


app.post('/SearchIpd',async function (req, res){
    const patientNameQuery = req.body.PatientName;
    const phoneNoQuery = req.body.Phonenumber;

    const searchQuery = {};

    if (patientNameQuery) {
        searchQuery.PatientName = patientNameQuery;
      }
  
      if (phoneNoQuery) {
        searchQuery.Phonenumber = phoneNoQuery;
      }
  
    const searchResults=await db.getDb().collection('inpatient').find(searchQuery).toArray();

    res.render('searchinpatient',{searchResults})
    });

    //Result Environment
    app.get('/SearchPatientd/:id', async function(req, res) {
        const id = req.params.id.trim();
      
        try {
            const OpSearch = await db.getDb().collection('outpatient').findOne({ _id: new ObjectId(id) });
          const IpSearch = await db.getDb().collection('inpatient').findOne({ _id: new ObjectId(id) });
      
          
let data;

if (OpSearch) {
    data = OpSearch;
} else if (IpSearch) {
    data = IpSearch;
} else {
    // No matching document found in either collection
    data = null;
}     
          if (data) {
            res.render('viewipdata', { data });
          } else {
            console.log('No data found for the provided id');
            res.redirect('/'); 
          }
        } catch (error) {
          console.error('Error:', error);
          res.redirect('/'); // Redirect to a suitable page
        }
      });



    app.get('/SearchIpd/:id', async function(req, res) {
        const id = req.params.id.trim();
      
        try {
          const data = await db.getDb().collection('inpatient').findOne({ _id: new ObjectId(id) });
      
          if (data) {
            res.render('viewipdata', { data });
          } else {
            console.log('No data found for the provided id');
            res.redirect('/'); // Redirect to a suitable page
          }
        } catch (error) {
          console.error('Error:', error);
          res.redirect('/'); // Redirect to a suitable page
        }
      });
    

app.get('/SearchOpd/:id', async function(req, res) {
        const id = req.params.id.trim();
      
        try {
          const data = await db.getDb().collection('outpatient').findOne({ _id: new ObjectId(id) });
      
          if (data) {
            res.render('viewopdata', { data });
          } else {
            console.log('No data found for the provided id');
            res.redirect('/'); // Redirect to a suitable page
          }
        } catch (error) {
          console.error('Error:', error);
          res.redirect('/'); // Redirect to a suitable page
        }
      });


app.use(function(req,res)
{
    res.render('NotAvailable')
})

module.exports=app;

db.connectToDatabase().then(function () {
    app.listen(500);
  });
  