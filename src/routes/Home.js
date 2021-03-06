import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import {
	collection,
	getFirestore,
	query,
	orderBy,
	onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";

function Home(props) {
	const { userObj } = props;

	const [nweets, setNweets] = useState([]);
	const db = getFirestore();
	// const getNweets = async () => {
	// 	const querySnapshot = await getDocs(collection(db, "nweets"));
	// 	querySnapshot.forEach((doc) => {
	// 		const nweetObj = {
	// 			...doc.data(),
	// 			id: doc.id,
	// 		};
	// 		setNweets((prev) => [...prev, nweetObj]);
	// 	});
	// };
	// 구식의 방법임.
	useEffect(() => {
		// getNweets();
		const q = query(collection(db, "nweets"), orderBy("createdAt", "desc"));
		onSnapshot(q, (snapshot) => {
			const nweetArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNweets(nweetArr);
		});
	}, []);

	return (
		<div className={styles.container}>
			<NweetFactory userObj={userObj} />

			<div style={{ marginTop: 30 }}>
				{nweets.map((nweet) => (
					<Nweet
						key={nweet.id}
						nweetObj={nweet}
						isOwner={nweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
}

export default Home;
