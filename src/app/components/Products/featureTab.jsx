const FeatureTab = ({features}) => {
  return (
    <div className="tab-content tab2 block w-full lg:w-[100%]">
          <h2 className="font-DanaDemiBold border-b-2 border-blue-500 w-fit p-1 text-lg">
            مشخصات کلی
          </h2>
          <div className="p-4 my-5 w-full mx-auto flex justify-center items-start gap-x-20">
            <ul className="space-y-3 text-gray-500 dark:text-gray-300 lg:w-1/4">
              {features.map((item) => (
                <li key={item.id}>{item.feature_detail?.name}</li>
              ))}
            </ul>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200 lg:w-3/4 ">
              {features.map((item) => (
                <li className="border-b-2 border-gray-200 dark:border-gray-700" key={item.id}>{item.value}</li>
              ))}
            </ul>
          </div>
        </div>
  );
}

export default FeatureTab