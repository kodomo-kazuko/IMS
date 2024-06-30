import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:jobhub_v1/constants/app_constants.dart';

import 'package:jobhub_v1/controllers/bookmark_provider.dart';
import 'package:jobhub_v1/controllers/chat_provider.dart';
import 'package:jobhub_v1/controllers/image_provider.dart';
import 'package:jobhub_v1/controllers/jobs_provider.dart';
import 'package:jobhub_v1/controllers/login_provider.dart';
import 'package:jobhub_v1/controllers/onboarding_provider.dart';
import 'package:jobhub_v1/controllers/profile_provider.dart';
import 'package:jobhub_v1/controllers/signup_provider.dart';
import 'package:jobhub_v1/controllers/zoom_provider.dart';
import 'package:jobhub_v1/views/ui/mainscreen.dart';
import 'package:jobhub_v1/views/ui/onboarding/onboarding_screen.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

Widget defaultHome = const OnBoardingScreen();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();

  final entrypoint = prefs.getBool('entrypoint') ?? false;

  if (entrypoint) {
    defaultHome = const MainScreen();
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => OnBoardNotifier()),
        ChangeNotifierProvider(create: (context) => LoginNotifier()),
        ChangeNotifierProvider(create: (context) => ZoomNotifier()),
        ChangeNotifierProvider(create: (context) => SignUpNotifier()),
        ChangeNotifierProvider(create: (context) => JobsNotifier()),
        ChangeNotifierProvider(create: (context) => BookMarkNotifier()),
        ChangeNotifierProvider(create: (context) => ImageUpoader()),
        ChangeNotifierProvider(create: (context) => ProfileNotifier()),
        ChangeNotifierProvider(create: (context) => ChatNotifier()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      useInheritedMediaQuery: true,
      designSize: const Size(375, 825),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return GetMaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Dbestech JobHub',
          theme: ThemeData(
            scaffoldBackgroundColor: Color(kLight.value),
            iconTheme: IconThemeData(color: Color(kDark.value)),
            primarySwatch: Colors.grey,
          ),
          home: defaultHome,
        );
      },
    );
  }
}
