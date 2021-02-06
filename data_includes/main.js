// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of available elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
//PennController.DebugOff();


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
Sequence("training", SendResults())


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(750)
        .start()
        .wait()
)
// .log( "Name" , getVar("ParticipantName") )
// Log the participant
//.log("Name", getVar("ParticipantName"))
.log("ParticipantID", PennController.GetURLParameter("participant") );
// This log command adds a column reporting the participant's name to every line saved to the results

Template("stims.csv", row =>
    newTrial("training",
        newCanvas("container", "500px","5em")
            .print("center at 20vw","middle at 50vh")
        ,
        newText("Item", row.CARRIER)
            .print("center at 50%", "top at 0%", getCanvas("container"))
            .log()
        ,
        defaultText.css("white-space","nowrap")
        ,
        alts=[row.SENTENCE1,row.SENTENCE2].sort(()=>Math.random()-Math.random())
        ,
        newText("Alt1", alts[0]).print("center at 0%", "top at 2em", getCanvas("container"))
        ,
        newText("Alt2", alts[1]).print("center at 100%", "top at 2em", getCanvas("container"))
        ,
        newScale("slider", 100)
            .slider()
            .size("500px", "1em")
            .css("max-width", "unset")
            .print(0, "bottom at 100%", getCanvas("container"))
            .log()
            .wait()
        ,
        newTimer(500).start().wait()
    )
        // logs additional variables from stims file
        .log("ID", row.ID)
        .log("LIST", row.LIST)
        .log("S1", row.SENTENCE1)
        .log("S2", row.SENTENCE2)
        .log("CXN", row.CXN)
        .log("TARGET", row.TARGET)
        .log("ALT1", row.ALT1)
        .log("ALT2", row.ALT2)
        .log("VERB", row.VERB)
        .log("Alt1", alts[0])
        .log("Alt2", alts[1])

) // defines template for the main experiment

Template("stims.csv", row =>
    newTrial("main_old",

        newText("Item", row.CARRIER)
            .css("font-size", "1.5em")
            .css("font-family", "Verdana")
            .center()
            .print()
            .log()
        ,
    
        newCanvas("shapes", 200, 300)
            .settings.add(   0, 200, newText("left", row.SENTENCE1) )
            .settings.add( 300, 200, newText("right", row.SENTENCE2) )
            .print()
        ,
        newScale("slider",   100)
            //.before(newText("left", row.Sentence1))
            //.after(newText("right", row.Sentence2))
            .settings.slider()
            .size(500)
            .css("max-width", "unset")
            .print()
            .wait()
            .log()
        ,
        newTimer(500).start().wait()
    )
        // logs additional variables from stims file
        .log("ID", row.ID)
        .log("S1", row.SENTENCE1)
        .log("S2", row.SENTENCE2)
        .log("CXN", row.CXN)
        .log("TARGET", row.TARGET)
        .log("ALT1", row.ALT1)
        .log("ALT2", row.ALT2)
        .log("VERB", row.VERB)

) // defines template for the main experiment

SendResults("send") // send results to server before good-bye message

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

_AddStandardCommands(function(PennEngine){
    this.test = {
        passed: function(){
            return !PennEngine.controllers.running.utils.valuesForNextElement ||
                !PennEngine.controllers.running.utils.valuesForNextElement.failed
        }
    }
});