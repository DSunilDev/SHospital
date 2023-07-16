const express=require('express')
const path=require('path')
const app=express();
const db=require('./DATABASE/database.js');

app.use(express.static('styles'));

app.use(express.urlencoded({extended:true}))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.get('/',function(req,res)
{
    res.render('index');
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

app.get('/DoctorRecord',function(req,res)
{
    res.render('doctorrec')
})

app.get('/DoctorForm',function(req,res)
{
    res.render('doctorform')
})

app.post('/adddoctor',async function(req,res)
{
    const doctordata=req.body;
    const dname=doctordata.dname;
    const speciality=doctordata.Specialization;
    const phonenumber=doctordata.ph;

    const doctors={
        doctorname:dname,
        special:speciality,
        phone:phonenumber
    };
    
    await db.getDb().collection('doctor').insertOne(doctors);
    res.redirect('/doctor')
})

app.post('/addsurgery',async function(req,res)
{
    const surgerydata=req.body;
    const patientname=surgerydata.Name;
    const patientage=surgerydata.Age;
    const doj=surgerydata.doj;
    const dod=surgerydata.dod;
    const suregonname=surgerydata.Surgeon;
    const d=surgerydata.Diagnosis;

    const surgeryd={
        Patientname:patientname,
        PatientAge:patientage,
        dateofjoin:doj,
        dateofdischarge:dod,
        surgeon:suregonname,
        diagnosis:d
    };

    await db.getDb().collection('surgery').insertOne(surgeryd);
    res.redirect('/surgery')
})

app.get('/InPatientRecord',function(req,res)
{
    res.render('inpatientrec')
})

app.get('/OutPatientRecord',function(req,res)
{
    res.render('outpatientrec')
})

app.get('/SurgeryRecord',function(req,res)
{
    res.render('surgeryrec')
})

app.get('/InPatientForm',function(req,res)
{
    res.render('inpatientform')
})

app.get('/OutPatientForm',function(req,res)
{
    res.render('outpatientform')
})

app.get('/SurgeryForm',function(req,res)
{
    res.render('surgeryform')
})


app.use(function(req,res)
{
    res.render('NotAvailable')
})

module.exports=app;

db.connectToDatabase().then(function () {
    app.listen(3000);
  });
  