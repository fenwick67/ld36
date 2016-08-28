/*global $ _*/

var number = '(844) 293-0481';
var admin = false;
var magic = '85238';

$(function() {
    consolify($('#adminconsole'));
});

function consolify(el){
    
    var h = [
    '<pre id="terminaloutput"></pre>',
    '<div class="input-group">',
      '<input type="text" id="terminalinput" class="form-control" placeholder="Type your command here (try &quot;HELP&quot; )">',
      '<span class="input-group-btn">',
        '<button class="btn btn-primary" type="button" id="commandbutton">Submit Command</button>',
      '</span>',
    '</div>',
    ''
    ].join('\n');
    
    el.html(h);
    
    if (window.beatable()){
        kickOut();
    }
    
    //handle enter or button click
    el.on('keypress',function(e){
        if (e.key == 'Enter' || e.key == "Return"){
            //submit
            handleCommand(el.find('#terminalinput').val());
        }
    });
    
    $('#commandbutton').on('click tap',function(){
        handleCommand(el.find('#terminalinput').val());
    });
    
    function handleCommand(s){
        //clear input
        el.find('#terminalinput').val('');
        //put at end of term
        var stdout = $('#terminaloutput');
        
        var delim = admin?"ADMIN> ":"ANON> ";
        
        stdout.html(stdout.html() + '\n\n' + delim+ s );
        
        //different commands
        command(s.replace(/[\n\r\t]/ig,''),function(result){
            var framed = ('\n' + result).replace(/\n/ig,'\n   ');
            stdout.html( stdout.html() + framed);
            stdout.scrollTop(100000000000000);//hacky but works!
        });
    }
    
    
    //this is the function called with the string on every input.  
    function command(s,callback){
        
        s = s.toLowerCase();
        
        if (!admin){
            var commandList = ["",
            "HELP              : Show this",
            "LOGIN [password]  : Administrator login",
            "                      (example: entering 'LOGIN SECRET' would",
            "                      try to log in with a password of 'SECRET')"
            
            ];
            
            if (s === "help" || s === ""){
                return callback(lines + "\nAvailable commands: "+commandList.join('\n') + '\n' +lines);
            }
            
            if (s.indexOf('login') === 0){
                if (s.replace(/\s/ig,'').indexOf('loginpassword1') == 0 ){
                    //YOU LOGGED IN
                    admin = true;
                    el.addClass('admin');
                    return callback("Login successful.  Welcome, ADMIN.  Use HELP command to view commands" );
                }else{
                    return callback("INVALID LOGIN.  Please try again (unless you're not supposed to be here...)");
                }
            }
            
            
            
            return callback('Not valid command string: '+s+'');
        }else{
            var commandList = ["",
            "LOGOUT                                : Log out (duh)",
            "TICKET [ticketnumber]                 : view ticket info ",
            "NOTES [ticketnumber]                  : look up support notes for call &lt;confidential&gt;",
            "SETPARAM [ticket] [parameter] [value] : Set a parameter for a user.",
            '                                        (example: "SETPARAM 96583 DX5 32" ',
            '                                         would set the parameter DX5 to 32',
            '                                         for user with ticket ID 96583) '
            ];
            
            if (s === "help" || s === ""){
                return callback(lines + "\nAvailable commands: "+commandList.join('\n') + '\n' +lines);
            }
            
            if (s === 'logout' ){
                //YOU LOGGED IN
                admin = false;
                el.removeClass('admin');
                return callback("Logged out successfully." );
            }
            if (s.indexOf('ticket') == 0){
                //show ticket:
                var tn = s.replace('ticket','').replace(/\s/ig,'');
                var tick = window.ticketLookup(tn);
                console.log('gggg');
                if (!tick){
                    return callback ("ERROR: Bad ticket number: "+tn);
                }
                var out = '';
                for (var i = 0; i < tick.length; i ++){
                    out = out + '\n';
                    
                    for (var j = 0; j < tick[i].length; j ++){
                        if (j !== 0){
                            out = out + _.padEnd(tick[i][j],20); 
                        }
                    }
                }
                return callback(out);
            }
            if (s.indexOf("notes") === 0){
                var tn = s.replace('notes','').replace(/\s/ig,'');
                return callback(notesLookup(tn));
            }
            if (s.indexOf('setparam') === 0){
                var argv = s.split(/\s+/ig);
                if (argv.length != 4){
                    return callback("INVALID USAGE OF SETPARAM. \n\n SEE HELP FOR USAGE")
                }
                var ticket = argv[1];
                var parameter = argv[2];
                var value = argv[3];
                
                if (ticket === window.getUserErrorCode() && parameter === 'dmg' && value === "100"){
                    //let them win the game
                    window.localStorage.setItem("beatable","YES");
                    callback ('<b class="green">Successfully set parameter "'+parameter+'" to "'+value+'" for ticket #'+ticket+'</b>');
                    kickOut();
                    return;
                }
                
                if (!window.browserForTicket(ticket) && ticket !== magic ){
                    return callback ('TICKET NUMBER NOT FOUND: '+ticket);
                }
                
                return callback ('Successfully set parameter "'+parameter+'" to "'+value+'" for ticket #'+ticket);
                
            }
            
            return callback('Not valid command string: '+s+'');
        }
        
    }
    
    var lines = '*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*';
    
}

//lookup fenwicks notes on a phone conversation
function notesLookup(s){
    if (s == magic){
    //show some cool stuff
        return [
            'Issue log: '+magic,
            '',
            'It seems that setting debug parameter "DMG" to "100" in the console fixed it for this guy',
            "Unfortunately, I don't have time to fix this for everybody.  If a user calls in enough",
            "times or gets angry enough, you can walk them through using SETPARAM in the console.  ",
            "Otherwise, wait for the fix in a few days.  Screw 'em."
        ].join('\n');
    }else{
        var browser = window.browserForTicket(s);
        if (!browser){
            return "Unable to find ticket: "+s;
        }
        return [
            'Issue log: '+s,
            '',
            "This customer is a real tool and has a ridiculous accent.  You can barely understand him",
            "(or was it a woman?  Not sure).  Don't do anything for them, honestly.  See ticket 85238",
            "for reference on how you would actually fix it (but don't help this dude)",
            "",
            "Seriously, who still uses "+browser+"???  Talk about Ancient Technology. ",
            "",
            "The next person who interrupts my coffee break is going to seriously get what's coming ",
            "to them."
        ].join('\n');
    }
}

function kickOut(){
    //kick the user out
    var stdout = $('#terminaloutput');
    var delay = 2000;
    
    var kickMsgs = [
        "I see you",
        "",
        "You know, you really shouldn't be here",
        "You're aware I could prosecute you right?",
        "Have you read the DMCA?  The CFPA?",
        "I have your phone number",
        "Getting your name and address would be child's play",
        "now quit messing around"
    ];

    kickMsgs.forEach(function(msg,index){
         setTimeout(function(){
            stdout.html( stdout.html() + '\n<b class="green">' + msg + '</b>');
            stdout.scrollTop(100000000000000);//hacky but works!
        },index*delay);
    });
       
    // navigate back to game page
    setTimeout(function(){window.location.href = "/index.html"},kickMsgs.length *delay);
}  