// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of available elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
PennController.DebugOff();
SetCounter("inc", 1); // so that the counter is reset at every participant for more equal distribution


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
Sequence("intro", "instructions", randomize("training"), "intermission", sepWithN( "break" , randomize("experiment") , 16), "debrief", SendResults(), "goodbye")


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
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can <strong>work uninterrupted</strong>.</p>")
        .css("font-size", "1em")
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
    newText("<p>In English, speakers can often choose between two expressions that mean (roughly)<br/>" +
        "the same, but if your native language is English, you will usually have a preference.</p>" +
        "<p>Our team studies the circumstances under which learners of English come close(r) to<br/>"+
        "preferences of native English speakers, so we are interested in <strong>your intuitions</strong>.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Your task</strong></p>")
        .print()
    ,
    newText("<p>You will see sentences with choices that are difficult for learners. Your task is to<br/>"+
        "judge which is more acceptable by dragging a slider towards the better-sounding option.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newImage("s100", "s100.png")
        .size(400,)
        .center()
        .print()
    ,
    newText("<p>Sometimes both options are more or less equally good, so you can or should<br/>"+
        "indicate the <strong>strength of your preference</strong> by how far you move the slider.<br/>"+
        "For some sentences, one option sounds clearly “off”, while for others you may want<br/>" +
        "to move the slider only a little towards a (slightly) better option.</p>" +
        "<p><strong>Important</strong>: We are interested in <strong>your gut-feeling</strong>, so you should decide<br/>"+
        "<strong>quickly</strong>, but we do ask you to read both alternatives carefully.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Press SPACE to proceed to some training sentences to test the slider.")
        .css("font-family", "Verdana")
        .css("font-size", "1em")
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

        newCanvas("container", "500px", "13em")
            .print("center at 50vw","middle at 35vh")
        ,
        newText("<p><em>Click, hold & drag button along slider to indicate strength of preference.<br/>" +
            "You can move button <u>until you release it</u>; once released, new sentence appears.<br/>"+
            "You’ll have to move the button though, even if only very slightly.</em></p>")
            .css("font-size", "0.8em")
            .print("center at 50%", "bottom at 100%", getCanvas("container"))
        ,
        newText("Item", row.CARRIER)
            .print("center at 50%", "top at 0%", getCanvas("container"))
            .log()
        ,
        defaultText.css("white-space","nowrap")
        ,
        alts=[row.SENTENCE1,row.SENTENCE2]
            .sort(()=>Math.random()-Math.random())
        ,
        newText("Alt1", alts[0])
            .print("center at 0%", "top at 30%", getCanvas("container"))
        ,
        newText("Alt2", alts[1])
            .print("center at 100%", "top at 30%", getCanvas("container"))
        ,
        newScale("slider", 100)
            .slider()
            .size("500px", "1em")
            .css("max-width", "unset")
            .print(0, "bottom at 50%", getCanvas("container"))
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
        .log("VERB", row.VERB.ADJ)
        .log("Alt1", alts[0])
        .log("Alt2", alts[1])
        .log("PREF", row.PREF)
        .log("CHECK", row.CHECK)
        .log("EXP", row.EXP)

) // defines template for the main experiment

// INTERMISSION
newTrial("intermission",

    newText("<p><strong>OK, you should be good to go for judging the 56 sentences.</strong></p>" +
        "<p>Remember: use your gut-feeling! Try to be quick, but do pay close attention.</p>" +
        "<p>The differences between some options will be <em>very</em> minor, which is intentional.</p>" +
        "<p>The task is simple, but a bit monotonous and repetitive, so the experiment will pause<br/>"+
        "every 8 sentences, at which points you can take a (short) break if you want to. Please <em>do not</em><br/>"+
        "take breaks <em>while</em> a sentence is on the screen. Thank you!<br/></p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Press SPACE to proceed to main experiment.")
        .css("font-size", "1em")
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
            .print("center at 50vw","middle at 35vh")
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
        .log("VERB", row.VERB.ADJ)
        .log("Alt1", alts[0])
        .log("Alt2", alts[1])
        .log("PREF", row.PREF)
        .log("CHECK", row.CHECK)
        .log("EXP", row.EXP)
    ,
    newTrial("break",

        newText("<p>Have a short break if you want to. Press SPACE to continue.</p>")
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

    newText("<p>That’s (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Before you go, we’d very much appreciate if you take a brief moment to provide<br/>" +
        "voluntary feedback. This information will help us with the evaluation of the results.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Did you read the sentences out loud?</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("read", "yes", "no", "sometimes", "can’t remember", "prefer not to say")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
    newText("<p>Any thoughts on the experiment itself you’d like to share? Difficult? Fun?</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newTextInput("feedback", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-size", "1em")
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
    newText("<p>That’s it, thank you very much for your time and effort!</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<strong><a href='https://app.prolific.co/submissions/complete?cc=24E63A55'>Click here to return to Prolific to validate your participation.</a></strong>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><br/>You can contact the corresponding researcher <a href='https://www.sfla.ch/' target='_blank'>here</a> (opens new tab).</p>")
        .css("font-size", ".9em")
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