using System.Text;
using Backend.API.EndpointsSettings;
using Backend.API.Features.Analytics;
using Backend.API.Features.Cars;
using Backend.API.Features.Drivers;
using Backend.API.Features.GasStation;
using Backend.API.Features.Imports;
using Backend.API.Features.Login;
using Backend.API.Features.MaintenanceRecords;
using Backend.API.Features.Registration;
using Backend.API.Features.Reports;
using Backend.API.Features.Routes;
using Backend.API.Features.Targets;
using Backend.API.Features.Trips;
using Backend.API.Services;
using Backend.API.Services.Abstraction;
using Backend.DataAccess;
using Backend.DataAccess.Repositories;
using Backend.DataAccess.Repositories.Abstractions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Exceptions;

namespace Backend.API.Configuration;

public static class Di
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddSerilogLogging(configuration)
            .AddOpenApiSpec()
            .AddCors()
            .AddJwtAuthentication(configuration)
            .AddMyHandlers()
            .AddServices()
            .AddCacheServices()
            .AddRepositories()
            .AddRedis(configuration)
            .AddMyDbContext(configuration)
            .AddMyAntiforgery()
            .AddEndpoints(typeof(Di).Assembly);
    }

    private static IServiceCollection AddOpenApiSpec(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddEndpoints(typeof(Program).Assembly);

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("Application", "Backend.API"));

        return services;
    }

    private static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString(nameof(MyDbContext)));
        });

        return services;
    }

    private static IServiceCollection AddMyHandlers(this IServiceCollection services)
    {
        services.AddScoped<CarsGetAllHadler>();
        services.AddScoped<CarGetByIdHandler>();
        services.AddScoped<CarCreateHandler>();
        services.AddScoped<CarUpdateHandler>();
        services.AddScoped<CarDeleteHandler>();

        services.AddScoped<DriverCreateHandler>();
        services.AddScoped<DriverGetAllHandler>();
        services.AddScoped<DriverGetByIdHandler>();
        services.AddScoped<DriverUpdateHandler>();
        services.AddScoped<DriverDeleteHandler>();

        services.AddScoped<GasStationCreateHandler>();
        services.AddScoped<GasStationDeleteHandler>();
        services.AddScoped<GasStationUpdateHandler>();
        services.AddScoped<GasStationGetAllHandler>();
        services.AddScoped<GasStationGetByIdHandler>();

        services.AddScoped<MaintenanceRecordCreateHandler>();
        services.AddScoped<MaintenanceRecordDeleteHandler>();
        services.AddScoped<MaintenanceRecordUpdateHandler>();
        services.AddScoped<MaintenanceRecordGetAllHandler>();
        services.AddScoped<MaintenanceRecordGetByIdHandler>();

        services.AddScoped<RoutesCreateHandler>();
        services.AddScoped<RoutesUpdateHandler>();
        services.AddScoped<RoutesDeleteHandler>();
        services.AddScoped<RoutesGetAllHandler>();
        services.AddScoped<RoutesGetByIdHandler>();

        services.AddScoped<TargetsCreateHandler>();
        services.AddScoped<TargetsUpdateHandler>();
        services.AddScoped<TargetsDeleteHandler>();
        services.AddScoped<TargetsGetAllHandler>();
        services.AddScoped<TargetsGetByIdHandler>();

        services.AddScoped<TripsCreateHandler>();
        services.AddScoped<TripsUpdateHandler>();
        services.AddScoped<TripsDeleteHandler>();
        services.AddScoped<TripsGetAllHandler>();
        services.AddScoped<TripsGetByIdHandler>();

        services.AddScoped<CostRankingHandler>();

        services.AddScoped<LoginHandler>();
        services.AddScoped<RegistrationHandler>();
        services.AddScoped<GetMeHandler>();
        services.AddScoped<TripsReportHandler>();
        services.AddScoped<TripsImportHandler>();
        services.AddScoped<CommonReportHandler>();

        return services;
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<CarsService>();
        services.AddScoped<DriversService>();
        services.AddScoped<GasStationsService>();
        services.AddScoped<MaintenanceRecordsService>();
        services.AddScoped<RoutesService>();
        services.AddScoped<TargetsService>();
        services.AddScoped<ITripsService, TripsService>();
        services.AddScoped<AnalyticsService>();
        services.AddScoped<UsersService>();
        services.AddScoped<JwtService>();
        services.AddScoped<HashService>();
        services.AddScoped<ReportsService>();

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ICarsRepository, CarsRepository>();
        services.AddScoped<IDriversRepository, DriversRepository>();
        services.AddScoped<ITripsRepository, TripsRepository>();
        services.AddScoped<GasStationsRepository>();
        services.AddScoped<MaintenanceRecordsRepository>();
        services.AddScoped<RouteRepository>();
        services.AddScoped<TargetsRepository>();
        services.AddScoped<AnalyticsRepository>();
        services.AddScoped<UsersRepository>();

        return services;
    }

    private static IServiceCollection AddCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
        });

        return services;
    }

    private static IServiceCollection AddCacheServices(this IServiceCollection services)
    {
        services.AddScoped<ITripsCacheService, TripsCacheService>();

        return services;
    }

    private static IServiceCollection AddMyAntiforgery(this IServiceCollection services)
    {
        services.AddAntiforgery(options =>
        {
            options.Cookie.Name = ".AspNetCore.Antiforgery.7iEtVOfI_Ps";
            options.Cookie.HttpOnly = true;
            options.HeaderName = "X-CSRF-TOKEN";
            options.SuppressXFrameOptionsHeader = false;
        });

        return services;
    }

    private static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JWT");
        var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtSettings["Issuer"]!,
                ValidAudience = jwtSettings["Audience"]!,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["token"];

                    return Task.CompletedTask;
                },
            };
        });

        services.Configure<JwtOptions>(configuration.GetSection("JWT"));

        services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy => policy.RequireRole("Администратор"));
            options.AddPolicy("Dispatcher", policy => policy.RequireRole("Диспетчер"));
            options.AddPolicy("Driver", policy => policy.RequireRole("Водитель"));
            options.AddPolicy("Staff", policy => policy.RequireRole("Администратор", "Диспетчер", "Водитель"));
        });

        services.AddHttpContextAccessor();

        return services;
    }
}