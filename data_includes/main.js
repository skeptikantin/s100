// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of available elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
//PennController.DebugOff();


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
Sequence("intro", "instructions", "training", sepWithN( "break" , randomize("experiment") , 6), "debrief", SendResults(), "goodbye")


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

// INTRO LANDING PAGE
newTrial("intro",

    newText("<p>Welcome!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>You have been selected for this study because you indicated that you are a<br/>" +
        "native-speaker of English. Your participation will help us study how people learn English.</p>")
        .print()
    ,
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can <strong>work uninterrupted</strong>.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>By hitting SPACE I consent to the above.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
)

// INSTRUCTIONS
newTrial("instructions" ,

    newText("<p><strong>The acceptability study</strong></p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>One of the key challenges even for advanced learners of English is the choice between two<br/>" +
        "expressions that mean the same. For example, <em>The editor's opinion</em> and <em>The opinion of the editor</em><br/>"+
        "are equally possible, but native speakers tend to have clear preferences. We study the circumstances under<br/>"+
        "which learners come close(r) to native-speaker choices, and we are interested in <strong>your preferences</strong>.</p>"+
        "<p>You will see a number of sentences with two choices that are typically difficult for learners.</p>"+
        "<p>Your task is to give an indication about the acceptability of either option by<br/>"+
        "dragging a slider towards the better-sounding alternative.</p>")
        .print()
    ,
    newImage("maze", "lmaze.png")
        .size(200,)
        .center()
        .print()
    ,
    newText("<p>For some sentences, one option clearly sounds \"off\", in which case you should move the slider further<br/>" +
        "than for those where both alternatives are quite possible. You can vary how far you move the slider depending on how<br/>" +
        "much you think one alternative sounds better.</p>" +
        "<p><strong>IMPORTANT</strong>: We are interested in <strong>your gut-feeling</strong>, so you should decide <strong>quickly</strong>,<br/>"+
        "although we do ask you to always read both alternatives carefully before you make a choice.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Press space to proceed to a training phase to test the slider behavior.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
) // instructions

// TRAINING
Template("training.csv", row =>
    newTrial("training",
        newText("<p>You can move the slider as often as you want in either direction<br/>" +
            "<strong>until you release it</strong>; once released, the next sentence will appear.</p>")
            .print()
        ,
        newCanvas("container", "500px","10em")
            .print("center at 50vw","middle at 40vh")
        ,
        newText("Item", row.CARRIER)
            .print("center at 50%", "top at 0%", getCanvas("container"))
            .log()
        ,
        defaultText.css("white-space","nowrap")
        ,
        alts=[row.SENTENCE1,row.SENTENCE2].sort(()=>Math.random()-Math.random())
        ,
        newText("Alt1", alts[0]).print("center at 0%", "top at 5em", getCanvas("container"))
        ,
        newText("Alt2", alts[1]).print("center at 100%", "top at 5em", getCanvas("container"))
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
        .log("CHECK", row.CHECK)

) // defines template for the main experiment

// INTERMISSION
newTrial("intermission" ,

    newText("<p>OK, you should be good to go.<br/>" +
        "Remember: try to be quick, but pay attention.</p>" +
        "<p>Some decisions will be tougher than others.</p>" +
        "<p>The task is simple, but a bit tiring, so there are designated<br/>" +
        "breaks every 16 sentences.<br/></p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Press SPACE to proceed to main experiment.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
) // instructions

Template("stims.csv", row =>
    newTrial("experiment",
        newCanvas("container", "500px","10em")
            .print("center at 50vw","middle at 40vh")
        ,
        newText("Item", row.CARRIER)
            .print("center at 50%", "top at 0%", getCanvas("container"))
            .log()
        ,
        defaultText.css("white-space","nowrap")
        ,
        alts=[row.SENTENCE1,row.SENTENCE2].sort(()=>Math.random()-Math.random())
        ,
        newText("Alt1", alts[0]).print("center at 0%", "top at 5em", getCanvas("container"))
        ,
        newText("Alt2", alts[1]).print("center at 100%", "top at 5em", getCanvas("container"))
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
        .log("CHECK", row.CHECK)
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )

) // defines template for the main experiment

newTrial("debrief",

    newText("<p>That's (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Before you go, we'd appreciate it if you take a brief moment to provide voluntary feedback.<br/>" +
        "This information will help us with the evaluation of the results.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Please indicate your handedness:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("handedness", "right-handed", "left-handed", "no dominant hand", "rather not say")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
    newText("<p>In a few words: Any thoughts on the experiment itself? Difficult? Fun?</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newTextInput("feedback", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,
        newText("<p> </p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newButton("send", "Send results & proceed to verification link")
        .size(300)
        .center()
        .print()
        .wait()
)


SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>That's it, thank you very much for your time and effort!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Our feedback</strong>: The task you just did tries to measure how we process sentences<br/>"+
        "of varying (presumed) complexity. Trivially, more complex sentences take longer to read, but complexity<br/>"+
        "comes in various forms and can be located in different parts of a sentence. Maze experiments<br/>"+
        "help us learn more about how people understand and process language (well at least a tiny bit!).</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<strong><a href='https://app.prolific.co/submissions/complete?cc=8B2C141F'>Click here to return to Prolific to validate your participation.</a></strong>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><br/>You can contact the corresponding researcher <a href='https://www.sfla.ch/' target='_blank'>here</a> (opens new tab).</p>")
        .css("font-size", ".8em")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("void")
        .wait()
) // the good-bye message

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