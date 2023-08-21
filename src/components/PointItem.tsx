interface Props {
	nbPoints: number
	businessName: string
}

const PointItem = (props: Props) => {
	return (
		<div className="flex items-center gap-x-4 text-lg">
			<p>{props.businessName}</p>
			<hr className="flex-grow" />
			<p>{props.nbPoints}</p>
		</div>
	)
}

export default PointItem
