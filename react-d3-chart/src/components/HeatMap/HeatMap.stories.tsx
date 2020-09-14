import * as React from 'react';
import {storiesOf} from '@storybook/react';
import HeatMap from '.';
import * as d3 from 'd3';

const xLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255];
const yLabels = ["49", "50", "51"];
const matrix = [[9576, 10000, 8820, 9243, 8640, 9063, 7884, 8307, 7998, 8421, 7242, 7665, 7061, 7484, 6305, 6729, 8203, 8627, 7447, 7871, 7267, 7690, 6511, 6934, 6625, 7048, 5869, 6292, 5689, 6112, 4933, 5356, 7139, 7562, 6383, 6806, 6202, 6626, 5447, 5870, 5560, 5984, 4805, 5228, 4624, 5048, 3869, 4292, 5766, 6190, 5011, 5434, 4830, 5253, 4074, 4498, 4188, 4612, 3433, 3856, 3252, 3675, 2496, 2920, 8463, 8887, 7707, 8131, 7527, 7950, 6771, 7194, 6885, 7308, 6129, 6552, 5949, 6372, 5193, 5616, 7091, 7514, 6335, 6758, 6155, 6578, 5399, 5822, 5513, 5936, 4757, 5180, 4576, 5000, 3821, 4244, 6026, 6449, 5270, 5694, 5090, 5513, 4334, 4757, 4448, 4871, 3692, 4116, 3512, 3935, 2756, 3179, 4654, 5077, 3898, 4321, 3718, 4141, 2962, 3385, 3076, 3499, 2320, 2743, 2140, 2563, 1384, 1807, 8192, 8615, 7436, 7859, 7256, 7679, 6500, 6923, 6614, 7037, 5858, 6281, 5678, 6101, 4922, 5345, 6820, 7243, 6064, 6487, 5883, 6307, 5128, 5551, 5242, 5665, 4486, 4909, 4305, 4729, 3550, 3973, 5755, 6178, 4999, 5423, 4819, 5242, 4063, 4486, 4177, 4600, 3421, 3844, 3241, 3664, 2485, 2908, 4383, 4806, 3627, 4050, 3447, 3870, 2691, 3114, 2805, 3228, 2049, 2472, 1868, 2292, 1112, 1536, 7079, 7503, 6324, 6747, 6143, 6566, 5387, 5811, 5501, 5925, 4746, 5169, 4565, 4988, 3809, 4233, 5707, 6130, 4951, 5375, 4771, 5194, 4015, 4439, 4129, 4552, 3373, 3797, 3193, 3616, 2437, 2860, 4643, 5066, 3887, 4310, 3707, 4130, 2951, 3374, 3065, 3488, 2309, 2732, 2128, 2552, 1372, 1796, 3270, 3694, 2515, 2938, 2334, 2757, 1578, 2001, 1692, 2115, 936, 1359, 756, 1179, 0, 423], [6067, 4850, 7320, 6101, 5064, 3846, 6315, 5097, 4981, 3763, 6232, 5014, 3977, 2758, 5228, 4011, 4602, 3384, 5854, 4636, 3599, 2379, 4850, 3632, 3516, 2296, 4767, 3549, 2510, 1287, 3763, 2544, 7279, 6060, 8535, 7313, 6274, 5056, 7527, 6308, 6191, 4973, 7444, 6225, 5187, 3970, 6439, 5221, 5813, 4595, 7065, 5846, 4809, 3591, 6060, 4843, 4726, 3508, 5977, 4760, 3722, 2503, 4974, 3756, 7522, 6302, 8779, 7556, 6517, 5299, 7770, 6550, 6434, 5216, 7687, 6467, 5430, 4212, 6682, 5463, 6055, 4837, 7308, 6089, 5051, 3834, 6303, 5085, 4968, 3751, 6220, 5002, 3965, 2746, 5216, 3999, 8737, 7515, 10000, 8772, 7729, 6509, 8987, 7763, 7646, 6426, 8903, 7680, 6640, 5422, 7894, 6674, 7267, 6048, 8523, 7301, 6262, 5044, 7515, 6296, 6179, 4961, 7432, 6212, 5175, 3958, 6427, 5209, 4790, 3572, 6041, 4824, 3787, 2567, 5038, 3820, 3703, 2484, 4955, 3737, 2698, 1476, 3951, 2732, 3325, 2105, 4577, 3359, 2319, 1096, 3573, 2353, 2236, 1012, 3490, 2270, 1227, 0, 2484, 1262, 6000, 4783, 7253, 6034, 4997, 3779, 6248, 5031, 4914, 3696, 6165, 4948, 3910, 2691, 5162, 3944, 4536, 3317, 5787, 4569, 3532, 2312, 4783, 3565, 3449, 2229, 4700, 3482, 2443, 1220, 3697, 2477, 6243, 5025, 7496, 6277, 5239, 4022, 6491, 5273, 5156, 3939, 6408, 5190, 4153, 2934, 5404, 4186, 4778, 3560, 6029, 4812, 3774, 2555, 5026, 3808, 3691, 2472, 4943, 3725, 2686, 1464, 3939, 2720, 7455, 6236, 8712, 7489, 6450, 5232, 7703, 6483, 6367, 5149, 7620, 6400, 5363, 4145, 6615, 5397, 5988, 4771, 7241, 6022, 4985, 3767, 6236, 5018, 4902, 3684, 6153, 4935, 3898, 2679, 5149, 3932], [6067, 4850, 7320, 6101, 5064, 3846, 6315, 5097, 4981, 3763, 6232, 5014, 3977, 2758, 5228, 4011, 4602, 3384, 5854, 4636, 3599, 2379, 4850, 3632, 3516, 2296, 4767, 3549, 2510, 1287, 3763, 2544, 7279, 6060, 8535, 7313, 6274, 5056, 7527, 6308, 6191, 4973, 7444, 6225, 5187, 3970, 6439, 5221, 5813, 4595, 7065, 5846, 4809, 3591, 6060, 4843, 4726, 3508, 5977, 4760, 3722, 2503, 4974, 3756, 7522, 6302, 8779, 7556, 6517, 5299, 7770, 6550, 6434, 5216, 7687, 6467, 5430, 4212, 6682, 5463, 6055, 4837, 7308, 6089, 5051, 3834, 6303, 5085, 4968, 3751, 6220, 5002, 3965, 2746, 5216, 3999, 8737, 7515, 10000, 8772, 7729, 6509, 8987, 7763, 7646, 6426, 8903, 7680, 6640, 5422, 7894, 6674, 7267, 6048, 8523, 7301, 6262, 5044, 7515, 6296, 6179, 4961, 7432, 6212, 5175, 3958, 6427, 5209, 4790, 3572, 6041, 4824, 3787, 2567, 5038, 3820, 3703, 2484, 4955, 3737, 2698, 1476, 3951, 2732, 3325, 2105, 4577, 3359, 2319, 1096, 3573, 2353, 2236, 1012, 3490, 2270, 1227, 0, 2484, 1262, 6000, 4783, 7253, 6034, 4997, 3779, 6248, 5031, 4914, 3696, 6165, 4948, 3910, 2691, 5162, 3944, 4536, 3317, 5787, 4569, 3532, 2312, 4783, 3565, 3449, 2229, 4700, 3482, 2443, 1220, 3697, 2477, 6243, 5025, 7496, 6277, 5239, 4022, 6491, 5273, 5156, 3939, 6408, 5190, 4153, 2934, 5404, 4186, 4778, 3560, 6029, 4812, 3774, 2555, 5026, 3808, 3691, 2472, 4943, 3725, 2686, 1464, 3939, 2720, 7455, 6236, 8712, 7489, 6450, 5232, 7703, 6483, 6367, 5149, 7620, 6400, 5363, 4145, 6615, 5397, 5988, 4771, 7241, 6022, 4985, 3767, 6236, 5018, 4902, 3684, 6153, 4935, 3898, 2679, 5149, 3932]];

storiesOf('HeatMap', module).add('HeatMap', () => (
    <>
      <h1>Heat Map</h1>
      <HeatMap xLabels={xLabels} yLabels={yLabels} matrix={matrix}/>
    </>
));
