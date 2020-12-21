/*
This query plan return the query that shows applicant who Approved in step1 or step2 
and submitted(updatedAt) after given date (fromDate) from given Cites.
if the given cites is empty it return applicants in all cities
*/
// eslint-disable-next-line max-len
const cityConditionMaker = (cities) => {
  if (cities.length > 0) {
    return cities.map((city) => ({ city }));
  }
  return [{}];
};

const queryPlan1 = (cities, fromDate = '2019-9-1') => {
  const stepId1 = '5cb8a846fbf8e118bb0e9e55';
  const stepId2 = '5cb8a88efbf8e118bb0e9e56';
  const stepStatus = 'Approved';

  const result = [
    {
      $lookup: {
        from: 'applicant_progresses',
        localField: 'userId',
        foreignField: 'userId',
        as: 'steps',
      },
    },
    { $unwind: '$steps' },
    {
      $match: {
        $and: [
          {
            $or: cityConditionMaker(cities),
          },
          {
            $and: [
              {
                $or: [{ 'steps.stepId': stepId1 }, { 'steps.stepId': stepId2 }],
              },
              { 'steps.status': stepStatus },
            ],
          },
          {
            'steps.updatedAt': { $gt: new Date(fromDate) },
          },
        ],
      },
    },
     { $count: 'count' },
  ];

  return result;
};

/*
this query return & project all student with corresponding steps in given cities
*/
const queryGetApplicants = (cities) => {
  const result = [
    {
      $lookup: {
        from: 'applicant_progresses',
        localField: 'userId',
        foreignField: 'userId',
        as: 'steps',
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        city: 1,
        cityId: 1,
        steps: { status: 1, stepId: 1, updatedAt: 1 },
        workshops: 1,
      },
    },
    {
      $match: {
        $or: cityConditionMaker(cities),
      },
    },
  ];
  return result;
};

module.exports = { queryPlan1, queryGetApplicants };
