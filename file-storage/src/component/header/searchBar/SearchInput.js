import { AutoComplete, Image, Input, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { getListSearch } from "../../../actions/rootAction";
import JpgIcon from "../../../images/jpg.svg";
import Mp3Icon from "../../../images/mp3.png";
import Mp4Icon from "../../../images/mp4.png";
import MusicMainIcon from "../../../images/music-main.png";
import PngIcon from "../../../images/png.svg";
import SvgIcon from "../../../images/svg.svg";
const renderIcon = (extension) => {
	switch (extension) {
		case "jpg":
			return <img className="img-type" alt="#" src={JpgIcon} />;
		case "png":
			return <img className="img-type" alt="#" src={PngIcon} />;
		case "svg":
			return <img className="img-type" alt="#" src={SvgIcon} />;
		case "mp3":
			return <img className="img-type" alt="#" src={Mp3Icon} />;
		case "mp4":
			return <img className="img-type" alt="#" src={Mp4Icon} />;
		default:
			break;
	}
};
const URI = 'http://127.0.0.1:6969/';
const SearchInput = () => {
	const dataUsers = useSelector((state) => state.auth);
	var { users } = dataUsers;
	const [options, setOptions] = useState([]);
	const handleClickItem = (rc) => {
		const extension = rc.extension;
		const src = rc.file_sk + '.' + rc.extension;
		if (extension.includes('mp')) {
			const title = rc.name;
			if (extension === 'mp4') {
				setIsVideoPlaying(true);
				setSrcVideo(URI + 'Videos/' + src);
				setTitleVideo(title);
			} else { // mp3
				setIsVideoPlaying(false);
				setSrcAudio(URI + 'Musics/' + src);
				setTitleAudio(title);
				// console.log(src);
			}
			setVisible(true);
		} else {
			setSrcImage(URI + 'Pictures/' + src);
			setPreview(true);
		}
	}
	const handleCancel = () => {
		setVisible(false);
		if (isVideoPlaying) {
			var videoElement = document.getElementsByTagName('video');
			videoElement[0].pause();
			videoElement[0].src = '';
			videoElement[0].load();
			setSrcVideo('');
		} else {
			var videoElement = document.getElementsByTagName('audio');
			videoElement[0].pause();
			videoElement[0].src = '';
			videoElement[0].load();
			setSrcAudio('');
		}
	}
	const handlePauseAudio = (cut) => {
		document.getElementById('img-audio').style.webkitAnimationPlayState = cut;
	}
	const [preview, setPreview] = useState(false);

	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [srcVideo, setSrcVideo] = useState('');
	const [titleVideo, setTitleVideo] = useState('');

	const [srcAudio, setSrcAudio] = useState('');
	const [titleAudio, setTitleAudio] = useState('');

	const [srcImage, setSrcImage] = useState('');
	const [visible, setVisible] = useState(false);

	const searchResult = (creator, token, query) => {
		// console.log(query, creator, token);
		getListSearch(creator, token, query)
			.then(res => {
				if (res.status === 200) {
					const ok = res.data.map(f => {
						// const category = `${query}`;
						return {
							key: f.id,
							value: '',
							label: (
								<Tooltip placement="topLeft" title={'Nhấn vào để xem'}>
									<div
										onClick={() => handleClickItem(f)}
										style={{
											width: '80%',
											display: 'flex',
											marginBottom: 3
										}}
									>
										{renderIcon(f.extension)}

										<span style={{ marginLeft: 7 }}>
											{f.name}
										</span>
									</div>
								</Tooltip >
							),
						};
					});
					setOptions(ok);
				} else {
					return [];
				}
			});
	};
	const getListSearchs = useRef(debounce((creator, token, query) => searchResult(creator, token, query), 500)).current;

	const handleSearch = (value) => {
		getListSearchs(users.username, users.token, value);
	};

	return (
		<>
			<AutoComplete
				dropdownMatchSelectWidth={252}
				options={options}
				onSearch={handleSearch}
			// onBlur={() => setOptions([])}
			>
				<Input.Search
					className="search-ngoc"
					size="large" placeholder="Tìm kiếm" enterButton />
			</AutoComplete >
			<Image
				preview={{
					visible: preview,
					onVisibleChange: () => { setPreview(false); setSrcImage('') },
					src: srcImage,
				}}
			/>
			<Modal
				className='model-custom'
				title={isVideoPlaying ? titleVideo : titleAudio}
				centered
				visible={visible}
				onCancel={() => { handleCancel() }}
				footer={null}
			>
				{isVideoPlaying ?
					<ReactPlayer
						height='fit-content'
						url={srcVideo}
						// loop
						stopOnUnmount={true}
						playing={true}
						controls={true}
						volume={1}
						muted={true}
					/> :
					<div style={{ width: 500 }}>
						<div style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
							<img id='img-audio' src={MusicMainIcon} alt="" width='150' height='150' />
						</div>
						<hr />
						<H5AudioPlayer
							autoPlay
							onPause={() => { handlePauseAudio('paused'); }}
							onPlay={() => { handlePauseAudio('running') }}
							src={srcAudio}
						/>
					</div>

				}
			</Modal>
		</>

	);
};

export default SearchInput;
