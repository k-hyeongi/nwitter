import React, { useState } from "react";
import { doc, deleteDoc, getFirestore, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import styles from "./Nweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Nweet(props) {
	const { nweetObj, isOwner } = props;
	const [editing, setEditing] = useState(false);
	const [newNweet, setNewNweet] = useState(nweetObj.text);

	const db = getFirestore();
	const storage = getStorage();

	const onDeleteClick = async () => {
		const ok = window.confirm("정말로 이 느윗을 삭제하시겠습니까?");
		if (ok) {
			// database의 기록 삭제
			await deleteDoc(doc(db, "nweets", `${nweetObj.id}`));
			// storage의 사진파일 삭제
			if (nweetObj.attachmentURL !== "") {
				await deleteObject(ref(storage, nweetObj.attachmentURL));
			}
			alert("느윗이 삭제되었습니다.");
		}
	};
	const toggleEditing = () => setEditing((prev) => !prev);
	const onSubmit = async (event) => {
		event.preventDefault();
		// doc(조건)에 부합하는 영역의 부분 수정하기
		await updateDoc(doc(db, "nweets", `${nweetObj.id}`), { text: newNweet });
		alert("느윗이 수정되었습니다.");
		setEditing(false);
	};
	const onChange = (event) => {
		const { value } = event.target;
		setNewNweet(value);
	};

	return (
		<div className={styles.nweet}>
			{editing ? (
				<>
					<form
						onSubmit={onSubmit}
						className={`${styles.nweetEdit} ${styles.container}`}
					>
						<input
							className={styles.formInput}
							type="text"
							placeholder="Edit your nweet"
							value={newNweet}
							required
							onChange={onChange}
						/>
						<input
							type="submit"
							value="수정"
							className={styles.formBtn}
						></input>
					</form>
					<button
						onClick={toggleEditing}
						className={`${styles.formBtn} ${styles.cancelBtn}`}
					>
						Cancel
					</button>
				</>
			) : (
				<>
					<h4>{nweetObj.text}</h4>
					{nweetObj.attachmentURL && (
						<img src={nweetObj.attachmentURL} alt="" />
					)}
					{isOwner ? (
						<div className={styles.nweetActions}>
							<button onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</button>
							<button onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</button>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}

export default Nweet;
