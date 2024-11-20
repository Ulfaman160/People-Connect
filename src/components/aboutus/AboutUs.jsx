import React from 'react';

const AboutUs = () => {
    return (
        <div style={{ marginTop: "10px", padding: "10px 20px", fontFamily: "Kalam, cursive" }}>
            We're so glad you're here! At People-Connect, our goal is simple – to make your life a little bit easier,
            more fun, or just a bit brighter by connecting people world-wide. We are a passionate team of dreamers,
            creators, and doers, all united by our shared love for People-Connect.

            <br /><br />
            It all started with a simple idea: [Briefly describe the origin story]. From humble beginnings, we’ve grown into a team of
            dedicated professionals who are driven to bring you the best in chatting experience. Our journey has been shaped by the belief
            that there should be no limitaions to have a good conversation with people all over the world.
            <br /><br />
            Behind every great company, there’s an even greater team. Meet the passionate people who are driving our mission forward.
            Together, we’re not just building a business – we’re building relationships, solving problems, and making a difference.

            <div style={{ marginTop: "180px", padding: "10px 20px", fontFamily: "Kalam, cursive", textAlign: "center" }}>
                <h3 style={{ marginBottom: "20px" }}>Developed By</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                        <img src="/pfp.png" style={{ height: "100px", borderRadius: "50%" }} alt="" />
                        <p>Indramoni Deka</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <img src="/pfp.png" style={{ height: "100px", borderRadius: "50%" }} alt="" />
                        <p>Parag Deka</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
