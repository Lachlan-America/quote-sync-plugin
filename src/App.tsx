import { useState } from "react"
import { framer, useIsAllowedTo } from "framer-plugin"
import "./App.css"

// Show how the UI should be displayed in Framer
framer.showUI({
    position: "center",
    width: 300,
    height: 200,
})

/* The code for the main plugin */
export function App() {
    // Need to check permissions before the plugin can access pluginData
    const isAllowed = useIsAllowedTo("setPluginData", "addComponentInstance")
    // This is used to determine whether to show the author in the quote component
    const [authorToggle, setAuthorToggle] = useState<boolean>(false)

    /*
    * This function fetches a random quote from The Quotes Hub API and instantiates a Framer component with the quote data.
    */
    const handleSyncQuote = async () => {
        const res = await fetch("https://thequoteshub.com/api/")
        const data = await res.json()
        // Check if the data is valid
        if (!data || !data.text) {
            console.error("Failed to fetch quote data.")
            return
        }
        console.log(data)

        // Have to ensure permissions are granted before using the following methods
        if (isAllowed) {
            // Set the storage keys to the main quote and author
            await framer.setPluginData("quote", data.text)
            await framer.setPluginData("author", data.author)

            await framer.addComponentInstance({ url: "https://framer.com/m/Quote-3rGY.js@i1HEx1bL1u0Ctf1SMxfu",
            attributes: {
                // This is how to pass data to the component
                controls: {
                    content: data.text, 
                    author: data.author, 
                    authorToggle: authorToggle
                },
            }
        })
        } else {
            console.warn("Not allowed to access pluginData.")
        }
    }

    return (
        <main>
            <p style={{ marginTop: 8, fontSize: 12 }}>
                Click the button below to sync a random quote from The Quotes Hub API.
            </p>
            <div style={{ alignItems: "center", display: "flex" }}>
                <label style={{ paddingRight: 5, fontSize: 12 }}>Enable Author:</label>
                <label className="switch">
                    <input type="checkbox" checked={authorToggle} onChange={() => setAuthorToggle(!authorToggle)} />
                    <span className="slider round"></span>
                </label>
            </div>
            <button className="framer-button-primary" onClick={handleSyncQuote}>
                Sync Quote
            </button>
        </main>
    )
}
