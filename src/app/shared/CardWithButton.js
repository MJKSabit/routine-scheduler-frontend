export default function CardWithButton(
  { bgColor, disabled, icon, title, subtitle, status, onClick } = {
    bgColor: "info",
    disabled: false,
    icon: " mdi-autorenew",
    title: "Title",
    subtitle: "Subtitle",
    status: "Status",
    onClick: () => {},
  }
) {
  return (
    <div className="row">
      <div className="col stretch-card grid-margin">
        <div
          className={`card bg-gradient-${bgColor} card-img-holder text-white`}
        >
          <div className="card-body">
            <img
              src={require("../../assets/images/dashboard/circle.svg").default}
              className="card-img-absolute"
              alt="circle"
            />
            <h4 className="font-weight-normal mb-3">
              {title}
              <button
                disabled={disabled}
                type="button"
                className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3 box box-hover"
                onClick={onClick}
              >
                <i className={`mdi ${icon} mdi-24px float-right`}></i>
              </button>
            </h4>
            <h2 className="mb-5">{subtitle}</h2>
            <h6 className="card-text">{status}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
