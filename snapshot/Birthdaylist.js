// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: birthday-cake;
// Scriptable.app Birthdaylist
// Created by: Pfitschipfeil 
// GitHub: https://github.com/Pfitschipfeil/Birthdaylist
// Last Update: 2024-02-16
// Add this as widget to your home screen


// make it yours an change the next five variables
var myWidgetTitle = "Heute 🎂🎉"
var myNoGivenNameText = "Kein Vorname"
var myNoBirthdayText = "Niemand den du kennst"
var topBackgroundColor = "4c00b0"
var buttomBackgroundColor = "7600bc"


// Careful now the script starts!
var bdayNamesArray = []
var bdayNamesString = ""

let myContactContainer = await ContactsContainer.all() //All contact containers (iCloud, Exchange, etc. ) are used
let allContacts = await Contact.all(myContactContainer) //get all contacts from the containers

function findBirthdayContact(){

    //Date formatter only show month (zb: Feb) and day (zb: 1)
    const dayMonthDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    })

    //Date formatter only show year (zb: 1979)
    const yearDate = new Intl.DateTimeFormat('en-US', {
        year: "numeric"
    })

    const today = new Date()   //create today
    const currentDayMonth = dayMonthDate.format(today)  //convert today to month and day
    const currentYear = yearDate.format(today) //convert today to year

    let findContact = allContacts.forEach(
        function(Contact){

            let shortBirthdayDayMonth = dayMonthDate.format(Contact.birthday)
            let shortBirthdayYear = yearDate.format(Contact.birthday)

            if (Contact.birthday !== null){
                if (shortBirthdayDayMonth == currentDayMonth) {

                    let age = currentYear - shortBirthdayYear
                    let birthdayName = ""
                    
                    if (Contact.givenName !== ""){
                        let birthdayName = Contact.givenName
                        writeBirthdayNameToArray(birthdayName,age)
                    }
                    else{
                        let birthdayName = myNoGivenNameText
                        writeBirthdayNameToArray(birthdayName,age)
                    }
                }
            }
        }
    )
    
    //In case nobody has birthsday myNoBirthdayText will be written
    if (bdayNamesArray.length == 0){
        bdayNamesArray.push(myNoBirthdayText)
    }

    bdayNamesString = bdayNamesArray.join('\r\n'); //the birthday array will be converted to string with linebreaks
}

function writeBirthdayNameToArray(birthdayName,age){
    bdayNamesArray.push(birthdayName + " " + "(" + age + ")") //name and age are written to array
    //console.log(birthdayName + " " + "(" + age + ")")
}

let api = await findBirthdayContact()
let widget = await createWidget(api)
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentSmall()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
    let title = myWidgetTitle
    let widget = new ListWidget()
  
    // Add background gradient
    let gradient = new LinearGradient()
    gradient.locations = [0, 1]
    gradient.colors = [
      new Color(topBackgroundColor),
      new Color(buttomBackgroundColor)
    ]
    widget.backgroundGradient = gradient
  
    // Show app icon and title
    let titleStack = widget.addStack()
    titleStack.addSpacer(1)
    let titleElement = titleStack.addText(title)
    titleElement.textColor = Color.white()
    titleElement.textOpacity = 1
    titleElement.font = Font.boldSystemFont(20)
    widget.addSpacer(12)
   
    // Show API
    let nameElement = widget.addText(bdayNamesString)
    nameElement.textColor = Color.white()
    nameElement.font = Font.systemFont(13)
  
    return widget
  }