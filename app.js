const express=require('express')
const path=require('path')
const app=express();
const uuid = require('uuid');
const db=require('./DATABASE/database.js');
const { ObjectId } = require('mongodb');

let patientCounter = 0; 

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
    const phonenumber=doctordata.ph;

    const doctors={
        doctorname:dname,
        special:speciality,
        phone:phonenumber
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

    const surgeryd={
        Patientname:patientname,
        PatientAge:patientage,
        dateofjoin:doj,
        dateofsurgery:dos,
        dateofdischarge:dod,
        surgeon:suregonname,
        anesthesist:anesthesist,
        diagnosis:d
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
    const reason=inpatientdata.Reason;
    const Cons=inpatientdata.Consulted;
    const paddress=inpatientdata.Address;
    const phone=inpatientdata.ph;
    const join=inpatientdata.doj;
    const tim=inpatientdata.Time;
    const discharge=inpatientdata.dod;
    
    patientCounter++;
    const formattedCounter = patientCounter.toString().padStart(2, '0');
  
    const patientId = `IP${formattedCounter}`; 

    const inpatientd={
        PatientId: patientId,
        PatientName:pname,
        PatientAge:page,
        Guardian:pguard,
        Reason:reason,
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
    const outpatientdata=req.body;
    const pname=outpatientdata.Name;
    const page=outpatientdata.Age;
    const Guard=outpatientdata.Guardian;
    const reas=outpatientdata.Reason;
    const cons=outpatientdata.Consulted;
    const address=outpatientdata.Address;
    const phon=outpatientdata.ph;
    const date=outpatientdata.date;

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const uhidCounter = await getNextUHIDCounter(year, month); // Get the next UHID counter
  
    const formattedCounter = uhidCounter.toString().padStart(2, '0');
    const uhid = `${year}${month}${formattedCounter}`;
  
    const outpatientd={
        UHID: uhid, 
        PatientName:pname,
        PatientAge:page,
        Guardian:Guard,
        Reason:reas,
        Consulted:cons,
        Address:address,
        Phonenumber:phon,
        Date:date
    }

    await db.getDb().collection('outpatient').insertOne(outpatientd)
    res.redirect('/OPdata')
})

async function getNextUHIDCounter(year, month) {
    const lastUHID = await db.getDb().collection('outpatient').find({}).sort({ UHID: -1 }).limit(1).toArray();
  
    if (lastUHID.length === 0 || lastUHID[0].UHID.substring(0, 7) !== `${year}-${month}`) {
      // If there are no records for the current month, start the counter from 1
      return 1;
    } else {
      // Increment the counter based on the last UHID in the current month
      const lastCounter = parseInt(lastUHID[0].UHID.substring(8), 10);
      return lastCounter + 1;
    }
  }

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
    app.listen(1200);
  });
  