// Sample JSON data
const warnData = {
    details: [
        {
            warningStatementCode: "WTS",
            contents: [
                "Thunderstorm Warning issued at 11:40 a.m. on 24 Sep 2020 has been extended until 7:30 p.m. today.",
                "Thunderstorms are expected to occur over Hong Kong."
            ],
            updateTime: "2020-09-24T05:00:00+08:00"
        },
        {
            warningStatementCode: "WHOT",
            contents: [
                "The Very Hot Weather Warning has been issued by the Hong Kong Observatory at 07:00.",
                "The risk of heatstroke is high."
            ],
            updateTime: "2020-09-24T07:00:00+08:00"
        }
    ]
};

// Function to get warning details
function getWarningDetail(warncode, warnName) {
    // const name = document.getElementById('warn_name');
    // const statement = document.getElementById('warn_statement');

    // name.style.display = "block";
    // statement.style.display = "block";

    // name.innerText = warnName;

    // Find matching warning details
    const warning = warnData.details.find(item => item.warningStatementCode === warncode);

    console.log(warning.contents.join("\n"));

    // // Display contents if found, else show a default message
    // statement.innerText = warning ? warning.contents.join("\n") : "No details available for this warning.";
}

// Example usage
getWarningDetail("WTS", "Thunderstorm Warning");
