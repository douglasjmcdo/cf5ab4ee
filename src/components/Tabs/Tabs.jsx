const Tabs = ({inbox, setInbox, tabnames}) => {
    return (
        <nav className="tabs">
            {tabnames.map((tab) => {
                return (
                <button 
                className={inbox === tab ? "tabbutton active" : "tabbutton"}
                key={tab}
                onClick={() => setInbox(tab)}>
                    {tab}
                </button>)
            })}
        </nav>
    );
}

export default Tabs;