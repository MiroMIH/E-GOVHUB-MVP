import User from '../models/User.js';
import Publication from '../models/Publication.js';
import Comment from '../models/Comment.js';

// Controller function to get statistics and recent publications for the dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Get total number of publications
    const totalPublications = await Publication.countDocuments();

    // Get most recent publications (limit to 3)
    const recentPublications = await Publication.find().sort({ createdAt: -1 }).limit(3).select('title wilaya commune createdAt').lean();

    // Initialize arrays to store sentiment and language data
    let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let languageCounts = { };
    let sentimentTrend = [];
    let sentimentTrendBySentiment = { positive: [], negative: [], neutral: [] };

    // Iterate through publications to collect sentiment and language data
    const publications = await Publication.find().lean();
    publications.forEach(publication => {
      publication.comments.forEach(comment => {
        // Count sentiment distribution
        sentimentCounts[comment.sentiment]++;

        // Count language distribution
        languageCounts[comment.language] = (languageCounts[comment.language] || 0) + 1;

        // Format comment creation date
        const commentDate = new Date(comment.createdAt);
        const dateString = commentDate.toISOString().split('T')[0];

        // Update sentiment trend
        const existingTrendIndex = sentimentTrend.findIndex(entry => entry.date === dateString);
        if (existingTrendIndex !== -1) {
          sentimentTrend[existingTrendIndex][comment.sentiment]++;
        } else {
          const newTrendEntry = {
            date: dateString,
            positive: comment.sentiment === 'positive' ? 1 : 0,
            negative: comment.sentiment === 'negative' ? 1 : 0,
            neutral: comment.sentiment === 'neutral' ? 1 : 0
          };
          sentimentTrend.push(newTrendEntry);
        }

        // Update sentiment trend by sentiment
        if (!sentimentTrendBySentiment[comment.sentiment]) {
          sentimentTrendBySentiment[comment.sentiment] = [];
        }
        sentimentTrendBySentiment[comment.sentiment].push({ date: dateString, count: 1 });
      });
    });

    // Calculate distribution of publications by domain
    const domainDistribution = await Publication.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $project: { domain: '$_id', count: 1, _id: 0 } }
    ]);

    // Calculate average number of comments per publication
    let totalComments = 0;
    publications.forEach(publication => {
      totalComments += publication.comments.length;
    });
    const averageCommentsPerPublication = totalComments / totalPublications;

    // Calculate distribution of users by role
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { role: '$_id', count: 1, _id: 0 } }
    ]);

    // Calculate count of users by status
    const statusDistribution = await User.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    // Format sentiment trend by sentiment
    const sentimentTrendBySentimentFormatted = Object.entries(sentimentTrendBySentiment).map(([sentiment, data]) => ({
      sentiment,
      data: data.reduce((acc, curr) => {
        const existingIndex = acc.findIndex(entry => entry.date === curr.date);
        if (existingIndex !== -1) {
          acc[existingIndex].count++;
        } else {
          acc.push({ date: curr.date, count: 1 });
        }
        return acc;
      }, [])
    }));

    // Get all users and all publications
    const allUsers = await User.find().lean();
    const allPublications = await Publication.find().lean();

    // Send the dashboard data as the response
    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        publications: totalPublications,
        comments: totalComments,
        recentPublications,
        domainDistribution,
        averageCommentsPerPublication,
        roleDistribution,
        statusDistribution,
        sentimentDistribution: Object.entries(sentimentCounts).map(([sentiment, count]) => ({ sentiment, count })),
        languageDistribution: Object.entries(languageCounts).map(([language, count]) => ({ language, count })),
        sentimentTrend,
        sentimentTrendBySentiment: sentimentTrendBySentimentFormatted,
        allUsers,
        allPublications
      }
    });
  } catch (err) {
    // Handle errors
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
