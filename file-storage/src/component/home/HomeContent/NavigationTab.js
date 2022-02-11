import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const NavigationTab = ({ listBreadcrumb, handleItemBreadcrumbClick }) => {
	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={() => { handleItemBreadcrumbClick(-1); }}>
					<a><HomeOutlined /></a>
				</Breadcrumb.Item>
				{listBreadcrumb.map((item, idx) => (
					<Breadcrumb.Item key={idx} onClick={() => {
						handleItemBreadcrumbClick(idx);
					}}>
						<a>{item}</a>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>
			<hr></hr>
		</>
	);
};
export default NavigationTab;
